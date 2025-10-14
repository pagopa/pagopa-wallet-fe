/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable functional/immutable-data */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// eslint-disable-next-line functional/no-let
let buildCfg: any;

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k })
}));

jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => (
    <div data-testid="mui-box" {...props}>
      {children}
    </div>
  ),
  FormControlLabel: ({ control, label, ...rest }: any) => (
    <label data-testid="mui-fcl" {...rest}>
      {label}
      {control}
    </label>
  )
}));

jest.mock("../../../../components/commons/ErrorModal", () => ({
  __esModule: true,
  default: ({ open }: any) =>
    open ? <div data-testid="error-modal">ERR</div> : null
}));

jest.mock("../../../../components/FormButtons/FormButtons", () => ({
  FormButtons: ({ handleSubmit, disabledSubmit, loadingSubmit }: any) => (
    <button
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabledSubmit}
      data-loading={String(loadingSubmit)}
    >
      Submit
    </button>
  )
}));

jest.mock("../IframeCardField", () => ({
  IframeCardField: ({ id, loaded }: any) => (
    <div data-testid={`iframe-field-${id}`} data-loaded={String(loaded)}>
      {id}
    </div>
  )
}));

jest.mock("../CustomSwitch", () => (props: any) => (
  <input
    type="checkbox"
    data-testid="custom-switch"
    defaultChecked={props.defaultChecked}
    disabled={props.disabled}
    onChange={(e) => props.onChange(e, (e.target as HTMLInputElement).checked)}
  />
));

jest.mock("../../../../routes/models/routeModel", () => ({
  OUTCOME_ROUTE: {
    GENERIC_ERROR: "GENERIC_ERROR",
    SUCCESS: "SUCCESS"
  },
  ROUTE_FRAGMENT: {
    SESSION_TOKEN: "sessionToken",
    WALLET_ID: "walletId"
  },
  WalletRoutes: {
    GDI_CHECK: "GDI_CHECK",
    ESITO: "ESITO",
    ERRORE: "ERRORE"
  }
}));

const clearNavigationEvents = jest.fn();
jest.mock("../../../../utils/eventListener", () => ({
  clearNavigationEvents: jest.fn(() => clearNavigationEvents())
}));

const buildConfigMock = jest.fn((cfg: any) => cfg);
jest.mock("../../../../utils/buildConfig", () => ({
  __esModule: true,
  default: (cfg: any) => buildConfigMock(cfg)
}));

const cardDecode = jest.fn();
const apmDecode = jest.fn();
const ctxDecode = jest.fn();

jest.mock(
  "../../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestCardDetails",
  () => ({
    WalletVerifyRequestCardDetails: {
      decode: (...args: Array<any>) => cardDecode(...args)
    }
  })
);

jest.mock(
  "../../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestAPMDetails",
  () => ({
    WalletVerifyRequestAPMDetails: {
      decode: (...args: Array<any>) => apmDecode(...args)
    }
  })
);

jest.mock(
  "../../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestContextualCardDetails",
  () => ({
    WalletVerifyRequestContextualCardDetails: {
      decode: (...args: Array<any>) => ctxDecode(...args)
    }
  })
);

const setSessionItemMock = jest.fn() as jest.Mock;
const getFragmentsMock = jest.fn().mockReturnValue({
  sessionToken: "mockSessionToken",
  walletId: "mockWalletId"
}) as unknown as jest.Mock;

const redirectForPaymentWithContextualOnboardingMock = jest.fn() as jest.Mock;
const redirectToIoAppForPaymentMock = jest.fn() as jest.Mock;

const apiCreateSessionWalletMock = jest.fn() as jest.Mock;
const apiValidationsMock = jest.fn() as jest.Mock;

jest.mock("../../../../utils", () => ({
  __esModule: true,
  default: {
    url: {
      getFragments: getFragmentsMock,
      redirectForPaymentWithContextualOnboarding: redirectForPaymentWithContextualOnboardingMock,
      redirectToIoAppForPayment: redirectToIoAppForPaymentMock
    },
    storage: {
      setSessionItem: setSessionItemMock,
      SessionItems: {
        sessionToken: "sessionToken",
        walletId: "walletId",
        orderId: "orderId"
      }
    },
    api: {
      npg: {
        createSessionWallet: apiCreateSessionWalletMock,
        validations: apiValidationsMock
      }
    }
  }
}));

const navigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate
  };
});

const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originalLocation, replace: jest.fn() }
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation
  });
});

const Right = (right: any) => ({ _tag: "Right", right });
const Left = (left: any) => ({ _tag: "Left", left });

const confirmDataMock = jest.fn((cb?: () => void) => cb && cb());
beforeEach(() => {
  jest.clearAllMocks();
  // @ts-ignore
  global.Build = jest.fn().mockImplementation((cfg: any) => {
    buildCfg = cfg;
    return { confirmData: confirmDataMock };
  });
});

import IframeCardForm from "../IframeCardForm";

const sessionResponse = {
  orderId: "order-123",
  sessionData: {
    cardFormFields: [
      { id: "CARD_NUMBER" },
      { id: "EXPIRATION_DATE" },
      { id: "SECURITY_CODE" },
      { id: "CARDHOLDER_NAME" }
    ]
  }
};

const renderForm = (
  props: Partial<React.ComponentProps<typeof IframeCardForm>> = {}
) =>
  render(
    <MemoryRouter>
      <IframeCardForm isPayment {...props} />
    </MemoryRouter>
  );

describe("IframeCardForm", () => {
  beforeEach(() => {
    buildCfg = undefined;
  });

  it("base render + onAllFieldsLoaded passes loaded=true to the fields", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));
    apiValidationsMock.mockResolvedValue(Right({ details: {} }));
    cardDecode.mockReturnValue({ _tag: "Left", left: {} });
    apmDecode.mockReturnValue({ _tag: "Left", left: {} });
    ctxDecode.mockReturnValue({ _tag: "Left", left: {} });

    renderForm();

    await screen.findByTestId("iframe-field-CARD_NUMBER");

    buildCfg.onAllFieldsLoaded();
    await waitFor(() => {
      expect(screen.getByTestId("iframe-field-CARD_NUMBER")).toHaveAttribute(
        "data-loaded",
        "true"
      );
    });
  });

  it("submit => confirm => onReadyForPayment => branch CARD details => navigate to GDI_CHECK with state", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));
    apiValidationsMock.mockResolvedValue(
      Right({ details: { some: "payload" } })
    );
    cardDecode.mockReturnValue({
      _tag: "Right",
      right: { iframeUrl: "https://example.test/iframe" }
    });

    renderForm();

    await screen.findByTestId("iframe-field-CARD_NUMBER");
    buildCfg.onReadyForPayment();

    const submit = screen.getByTestId("submit-button");
    submit.removeAttribute("disabled");
    fireEvent.click(submit);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/GDI_CHECK", {
        state: { gdiIframeUrl: "https://example.test/iframe" }
      });
    });
  });

  it("APM details => external redirect via window.location.replace", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));
    apiValidationsMock.mockResolvedValue(
      Right({ details: { some: "payload" } })
    );
    cardDecode.mockReturnValue({ _tag: "Left", left: {} });
    apmDecode.mockReturnValue({
      _tag: "Right",
      right: { redirectUrl: "https://pay.example/redirect" }
    });

    renderForm();

    await screen.findByTestId("iframe-field-CARD_NUMBER");
    // @ts-ignore
    buildCfg.onReadyForPayment();

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith(
        "https://pay.example/redirect"
      );
    });
  });

  it("Contextual details => redirectForPaymentWithContextualOnboarding SUCCESS", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));
    apiValidationsMock.mockResolvedValue(
      Right({ details: { some: "payload" } })
    );
    cardDecode.mockReturnValue({ _tag: "Left", left: {} });
    apmDecode.mockReturnValue({ _tag: "Left", left: {} });
    ctxDecode.mockReturnValue({ _tag: "Right", right: { ok: true } });

    renderForm();

    await screen.findByTestId("iframe-field-CARD_NUMBER");
    // @ts-ignore
    buildCfg.onReadyForPayment();

    await waitFor(() => {
      expect(redirectForPaymentWithContextualOnboardingMock).toHaveBeenCalledWith(
        "mockWalletId",
        "SUCCESS"
      );
    });
  });

  it("all decode Left => redirectForPaymentWithContextualOnboarding GENERIC_ERROR", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));
    apiValidationsMock.mockResolvedValue(Right({ details: {} }));
    cardDecode.mockReturnValue({ _tag: "Left", left: {} });
    apmDecode.mockReturnValue({ _tag: "Left", left: {} });
    ctxDecode.mockReturnValue({ _tag: "Left", left: {} });

    renderForm();

    await screen.findByTestId("iframe-field-CARD_NUMBER");
    // @ts-ignore
    buildCfg.onReadyForPayment();

    await waitFor(() => {
      expect(redirectForPaymentWithContextualOnboardingMock).toHaveBeenCalledWith(
        "mockWalletId",
        "GENERIC_ERROR"
      );
    });
  });

  it("onPaymentComplete => navigate a /ESITO and clearNavigationEvents", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));
    apiValidationsMock.mockResolvedValue(Right({ details: {} }));
    cardDecode.mockReturnValue({ _tag: "Left", left: {} });
    apmDecode.mockReturnValue({ _tag: "Left", left: {} });
    ctxDecode.mockReturnValue({ _tag: "Left", left: {} });

    renderForm();
    await screen.findByTestId("iframe-field-CARD_NUMBER");
    buildCfg.onPaymentComplete();

    expect(clearNavigationEvents).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/ESITO");
  });

  it("onPaymentRedirect => clearNavigationEvents + window.location.replace", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));

    renderForm();
    await screen.findByTestId("iframe-field-CARD_NUMBER");

    buildCfg.onPaymentRedirect("https://acs.example/challenge");

    expect(clearNavigationEvents).toHaveBeenCalled();
    expect(window.location.replace).toHaveBeenCalledWith(
      "https://acs.example/challenge"
    );
  });

  it("createSessionWallet Left => onError => show ErrorModal", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Left(new Error("boom")));

    renderForm();

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    });
  });

  it("validations Left during onReadyForPayment => onError => show ErrorModal", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));
    apiValidationsMock.mockResolvedValue(Left(new Error("val KO")));

    renderForm();
    await screen.findByTestId("iframe-field-CARD_NUMBER");

    buildCfg.onReadyForPayment();

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    });
  });

  it("isPayment=false => onBuildError => window.location.replace('/ERROR')", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));

    render(
      <MemoryRouter>
        <IframeCardForm isPayment={false} />
      </MemoryRouter>
    );

    await screen.findByTestId("iframe-field-CARD_NUMBER");
    buildCfg.onBuildError();

    expect(window.location.replace).toHaveBeenCalledWith("/ERRORE");
  });

  it("confirmData triggers => onError => ErrorModal", async () => {
    apiCreateSessionWalletMock.mockResolvedValue(Right(sessionResponse));

    // @ts-ignore
    global.Build = jest.fn().mockImplementation((_cfg: any) => ({
      confirmData: () => {
        throw new Error("confirm KO");
      }
    }));

    renderForm();
    await screen.findByTestId("iframe-field-CARD_NUMBER");

    const submit = screen.getByTestId("submit-button");
    submit.removeAttribute("disabled");
    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    });
  });
});
