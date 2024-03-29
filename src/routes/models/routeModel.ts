export enum WalletRoutes {
  ROOT = "",
  PM_CARTE = "pm-onboarding/creditcard",
  PM_PAYPAL = "pm-onboarding/paypal",
  PM_BPAY = "pm-onboarding/bpay",
  ONBOARD_CARTE = "onboarding/creditcard",
  PAYMENT_CARTE = "payment/creditcard",
  ONBOARD_APM = "onboarding/apm",
  GDI_CHECK = "gdi-check",
  ESITO = "esito",
  ERRORE = "errore"
}

export enum OUTCOME_ROUTE {
  GENERIC_ERROR = "1",
  AUTH_ERROR = "14",
  CONFLICT = "15",
  SUCCESS = "0",
  CANCELED_BY_USER = "8",
  ACCOUNT_BPAY_NOT_PRESENT = "16"
}

export enum ROUTE_FRAGMENT {
  SESSION_TOKEN = "sessionToken",
  WALLET_ID = "walletId",
  PAYMENT_METHOD_ID = "paymentMethodId"
}
