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
  SUCCESS = "0",
  GENERIC_ERROR = "1",
  AUTH_ERROR = "2",
  INVALID_DATA = "3",
  TIMEOUT = "4",
  INVALID_CARD = "7",
  CANCELED_BY_USER = "8",
  INVALID_SESSION = "14",
  ALREADY_ONBOARDED = "15",
  ACCOUNT_BPAY_NOT_PRESENT = "16",
  PSP_ERROR = "25",
  BALANCE_LIMIT = "116",
  CVV_ERROR = "117",
  LIMIT_EXCEEDED = "121"
}

export enum ROUTE_FRAGMENT {
  SESSION_TOKEN = "sessionToken",
  WALLET_ID = "walletId",
  PAYMENT_METHOD_ID = "paymentMethodId"
}
