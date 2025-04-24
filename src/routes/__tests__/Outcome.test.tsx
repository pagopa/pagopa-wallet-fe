import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as O from "fp-ts/Option";
import Outcome from "../Outcome";
import * as utils from "../../utils";
import * as configModule from "../../config";
import { OUTCOME_ROUTE } from "../models/routeModel";

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock PageContainer
jest.mock("../../components/commons/PageContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

// Mock config
jest.mock("../../config", () => ({
  getConfigOrThrow: jest.fn()
}));

// Mock utils
jest.mock("../../utils", () => ({
  storage: {
    getSessionItem: jest.fn(),
    SessionItems: {
      walletId: "walletId",
      orderId: "orderId",
      sessionToken: "sessionToken"
    }
  },
  url: {
    redirectWithOutcome: jest.fn()
  },
  api: {
    npg: {
      getSessionWallet: jest.fn()
    }
  }
}));

describe("Outcome page", () => {
  const mockedGetSessionItem = utils.default.storage
    .getSessionItem as jest.Mock;
  const mockedRedirect = utils.default.url.redirectWithOutcome as jest.Mock;
  const mockedGetSessionWallet = utils.default.api.npg
    .getSessionWallet as jest.Mock;
  const mockedGetConfig = configModule.getConfigOrThrow as jest.Mock;
  const assertGenericErrorRedirect = async () => {
    render(<Outcome />);
    await waitFor(() =>
      expect(utils.default.url.redirectWithOutcome).toHaveBeenCalledWith(
        OUTCOME_ROUTE.GENERIC_ERROR,
        undefined
      )
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockedGetConfig.mockReturnValue({
      WALLET_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS: 500
    });
  });

  it("shows loading and then outcome content on successful API response", async () => {
    mockedGetSessionItem.mockImplementation((key: string) =>
      key === "walletId" || key === "orderId" || key === "sessionToken"
        ? { value: "test-value" }
        : undefined
    );

    mockedGetSessionWallet.mockResolvedValue({
      _tag: "Right",
      right: {
        outcome: 0
      }
    });

    render(<Outcome />);

    // Circular progress should be visible
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for content to appear
    await waitFor(() =>
      expect(screen.getByText("resultPage.justFewMoments")).toBeInTheDocument()
    );

    expect(
      screen.getByText("resultPage.completeOperationMsg")
    ).toBeInTheDocument();
    expect(screen.getByText("resultPage.continueToIO")).toBeInTheDocument();
  });

  it("redirects with GENERIC_ERROR on missing session data", async () => {
    mockedGetSessionItem.mockReturnValue(O.none);

    render(<Outcome />);

    await assertGenericErrorRedirect();
  });

  it("redirects with GENERIC_ERROR on failed API response", async () => {
    mockedGetSessionItem.mockImplementation(() => ({ value: "test" }));

    mockedGetSessionWallet.mockResolvedValue({
      _tag: "Left",
      left: new Error("Failed")
    });

    render(<Outcome />);

    await assertGenericErrorRedirect();
  });
  it("calls redirect on button click", async () => {
    mockedGetSessionItem.mockImplementation(() => ({ value: "test" }));
    mockedGetSessionWallet.mockResolvedValue({
      _tag: "Right",
      right: {
        outcome: 1
      }
    });

    render(<Outcome />);

    await waitFor(() =>
      expect(screen.getByText("resultPage.continueToIO")).toBeInTheDocument()
    );

    await userEvent.click(screen.getByText("resultPage.continueToIO"));

    expect(mockedRedirect).toHaveBeenCalled();
  });
  it("falls back to GENERIC_ERROR when outcome is null", async () => {
    mockedGetSessionItem.mockImplementation((key: string) =>
      O.some({ value: `mock-${key}` })
    );

    mockedGetSessionWallet.mockResolvedValue({
      _tag: "Right",
      right: {
        outcome: null
      }
    });

    render(<Outcome />);

    await waitFor(() =>
      expect(mockedRedirect).toHaveBeenCalledWith(
        OUTCOME_ROUTE.GENERIC_ERROR,
        undefined
      )
    );
  });
  it("redirects with GENERIC_ERROR when outcome is undefined", async () => {
    mockedGetSessionItem.mockImplementation((key: string) =>
      O.some({ value: `mock-${key}` })
    );

    mockedGetSessionWallet.mockResolvedValue({
      _tag: "Right",
      right: {
        outcome: undefined
      }
    });

    render(<Outcome />);

    await assertGenericErrorRedirect();
  });
  it("redirects with outcome 0 and passes walletId when it is present", async () => {
    mockedGetSessionItem.mockImplementation((key: string) => {
      if (key === "walletId") {
        return O.some({ value: "my-wallet-id" });
      }
      if (key === "orderId") {
        return O.some({ value: "mock-order-id" });
      }
      if (key === "sessionToken") {
        return O.some({ value: "mock-token" });
      }
      return O.none; // fallback safeguard
    });

    mockedGetSessionWallet.mockResolvedValue({
      _tag: "Right",
      right: {
        outcome: 0
      }
    });

    render(<Outcome />);

    await waitFor(() =>
      expect(mockedRedirect).toHaveBeenCalledWith(0, "my-wallet-id")
    );
  });
});
