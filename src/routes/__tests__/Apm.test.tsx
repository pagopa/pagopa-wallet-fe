import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as E from "fp-ts/Either";
import { getConfigOrThrow } from "../../config";
import { OUTCOME_ROUTE } from "../models/routeModel";
import Apm from "../Apm";

// Mock translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));
// Mock utils
jest.mock("../../utils", () => {
  const originalModule = jest.requireActual("../../utils");

  return {
    __esModule: true,
    default: {
      ...originalModule.default,
      api: {
        npg: {
          getPspsForWallet: jest
            .fn()
            .mockResolvedValue(E.right({ bundleOptions: [] })),
          createSessionWallet: jest.fn()
        }
      },
      url: {
        ...originalModule.default?.url,
        getFragments: jest.fn().mockReturnValue({
          sessionToken: "token123",
          walletId: "wallet123",
          paymentMethodId: "paypal",
          href: "#"
        }),
        redirectWithOutcome: jest.fn()
      },
      storage: {
        setSessionItem: jest.fn(),
        SessionItems: {
          sessionToken: "sessionToken",
          walletId: "walletId",
          orderId: "orderId"
        }
      }
    }
  };
});
jest.mock("../../config", () => ({
  getConfigOrThrow: jest.fn().mockReturnValue({
    WALLET_GDI_CHECK_TIMEOUT: 30000
  })
}));
import utils from "../../utils";
describe("Apm component", () => {
  const mockReplace = jest.fn();
  const locationSpy = jest
    .spyOn(globalThis, "location", "get")
    .mockReturnValue({
      ...window.location,
      replace: mockReplace
    });

  function clickWithAct(element: HTMLElement) {
    act(() => {
      fireEvent.click(element);
    });
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    locationSpy.mockRestore();
  });

  it("renders preamble initially", async () => {
    await act(async () => {
      render(<Apm />);
    });
    expect(screen.getByText("paypalPage.preamble.title")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "paypalPage.preamble.cta" })
    ).toBeInTheDocument();
  });

  it("transitions from preamble to form view on CTA click", async () => {
    await act(async () => {
      render(<Apm />);
    });
    clickWithAct(
      screen.getByRole("button", { name: "paypalPage.preamble.cta" })
    );

    await waitFor(() =>
      expect(screen.getByText("paypalPage.title")).toBeInTheDocument()
    );
  });

  it("renders PSP radio options", async () => {
    (utils.api.npg.getPspsForWallet as jest.Mock).mockResolvedValueOnce({
      _tag: "Right",
      right: {
        bundleOptions: [
          {
            idPsp: "psp-1",
            pspBusinessName: "PSP One",
            taxPayerFee: 1.5
          }
        ]
      }
    });

    await act(async () => {
      render(<Apm />);
    });
    clickWithAct(
      screen.getByRole("button", { name: "paypalPage.preamble.cta" })
    );

    await waitFor(() =>
      expect(screen.getByText("PSP One")).toBeInTheDocument()
    );
  });

  it("submits the form when a PSP is selected", async () => {
    const redirectUrl = "https://redirect.url";

    (utils.api.npg.getPspsForWallet as jest.Mock).mockResolvedValueOnce({
      _tag: "Right",
      right: {
        bundleOptions: [
          {
            idPsp: "psp-1",
            pspBusinessName: "PSP One",
            taxPayerFee: 1.5
          }
        ]
      }
    });

    (utils.api.npg.createSessionWallet as jest.Mock).mockResolvedValueOnce({
      _tag: "Right",
      right: {
        orderId: "order-id-123",
        sessionData: {
          redirectUrl
        }
      }
    });

    await act(async () => {
      render(<Apm />);
    });
    clickWithAct(
      screen.getByRole("button", { name: "paypalPage.preamble.cta" })
    );

    await waitFor(() => screen.getByText("PSP One"));
    clickWithAct(
      screen.getByRole("radio", {
        name: "PSP One paypalPage.pspInfoModal.info"
      })
    );
    clickWithAct(
      screen.getByRole("button", { name: "paypalPage.buttons.submit" })
    );

    await waitFor(() =>
      expect(window.location.replace).toHaveBeenCalledWith(redirectUrl)
    );
  });

  it("redirects to error page on failed PSP fetch", async () => {
    (utils.api.npg.getPspsForWallet as jest.Mock).mockResolvedValueOnce(
      E.left(new Error("mocked error"))
    );

    await act(async () => {
      render(<Apm />);
    });
    clickWithAct(
      screen.getByRole("button", { name: "paypalPage.preamble.cta" })
    );

    await waitFor(() =>
      expect(utils.url.redirectWithOutcome).toHaveBeenCalled()
    );
  });
  it("calls redirectWithOutcome with GENERIC_ERROR route", async () => {
    await act(async () => {
      render(<Apm />);
    });
    act(() => {
      jest.advanceTimersByTime(getConfigOrThrow().WALLET_GDI_CHECK_TIMEOUT);
    });
    expect(utils.url.redirectWithOutcome).toHaveBeenCalledWith(
      OUTCOME_ROUTE.GENERIC_ERROR
    );
  });
  it("opens and closes DrawerTransactionManager when help link is clicked", async () => {
    await act(async () => {
      render(<Apm />);
    });
    clickWithAct(
      screen.getByRole("button", { name: "paypalPage.preamble.cta" })
    );
    const helpLink = screen.getByRole("link", { name: "paypalPage.helpLink" });

    expect(helpLink).toBeInTheDocument();

    clickWithAct(helpLink);

    expect(
      screen.getByText("paypalPage.managerModal.title")
    ).toBeInTheDocument();

    clickWithAct(screen.getByTestId("CloseIcon"));

    const drawer = screen.getByRole("presentation", { hidden: true });
    expect(drawer).toHaveAttribute("aria-hidden", "true");
  });
});
