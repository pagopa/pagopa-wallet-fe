export enum WalletRoutes {
  ERRORE = "errore",
  ESITO = "esito",
  GDI_CHECK = "gdi-check",
  PM_CARTE = "pm-onboarding/creditcard",
  CARTE = "onboarding/creditcard",
  PM_BPAY = "pm-onboarding/bpay",
  PM_PAYPAL = "pm-onboarding/paypal",
  BPAY = "onboarding/bpay",
  ROOT = ""
}

export enum OUTCOME_ROUTE {
  GENERIC_ERROR = "1",
  AUTH_ERROR = "14",
  SUCCESS = "0"
}

export enum ROUTE_FRAGMENT {
  SESSION_TOKEN = "sessionToken",
  WALLET_ID = "walletId"
}
