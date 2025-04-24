import {
  WalletRoutes,
  OUTCOME_ROUTE,
  ROUTE_FRAGMENT
} from "../models/routeModel";

describe("WalletRoutes Enum", () => {
  it("should have correct values", () => {
    expect(WalletRoutes.ROOT).toBe("");
    expect(WalletRoutes.PM_CARTE).toBe("pm-onboarding/creditcard");
    expect(WalletRoutes.PM_PAYPAL).toBe("pm-onboarding/paypal");
    expect(WalletRoutes.PM_BPAY).toBe("pm-onboarding/bpay");
    expect(WalletRoutes.ONBOARD_CARTE).toBe("onboarding/creditcard");
    expect(WalletRoutes.PAYMENT_CARTE).toBe("payment/creditcard");
    expect(WalletRoutes.ONBOARD_APM).toBe("onboarding/apm");
    expect(WalletRoutes.GDI_CHECK).toBe("gdi-check");
    expect(WalletRoutes.ESITO).toBe("esito");
    expect(WalletRoutes.ERRORE).toBe("errore");
  });
});

describe("OUTCOME_ROUTE Enum", () => {
  it("should have correct values", () => {
    expect(OUTCOME_ROUTE.GENERIC_ERROR).toBe("1");
    expect(OUTCOME_ROUTE.AUTH_ERROR).toBe("14");
    expect(OUTCOME_ROUTE.CONFLICT).toBe("15");
    expect(OUTCOME_ROUTE.SUCCESS).toBe("0");
    expect(OUTCOME_ROUTE.CANCELED_BY_USER).toBe("8");
    expect(OUTCOME_ROUTE.ACCOUNT_BPAY_NOT_PRESENT).toBe("16");
  });
});

describe("ROUTE_FRAGMENT Enum", () => {
  it("should have correct values", () => {
    expect(ROUTE_FRAGMENT.SESSION_TOKEN).toBe("sessionToken");
    expect(ROUTE_FRAGMENT.WALLET_ID).toBe("walletId");
    expect(ROUTE_FRAGMENT.PAYMENT_METHOD_ID).toBe("paymentMethodId");
  });
});
