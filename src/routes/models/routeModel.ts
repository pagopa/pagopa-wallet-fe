import { getConfigOrThrow } from "../../config";

const { WALLET_CONFIG_API_HOST, WALLET_CONFIG_API_BASEPATH } =
  getConfigOrThrow();

export enum WalletRoutes {
  ERRORE = "errore",
  ESITO = "esito",
  GDI_CHECK = "gdi-check",
  PM_CARTE = "pm-onboarding/creditcard",
  CARTE = "onboarding/creditcard",
  PM_BPAY = "pm-onboarding/bpay",
  BPAY = "onboarding/bpay",
  ROOT = ""
}

export const EXTERNAL_OUTCOME = `${WALLET_CONFIG_API_HOST}${WALLET_CONFIG_API_BASEPATH}/v3/webview/logout/bye?outcome=`;

export enum NPG_OUTCOME_ROUTE {
  ERROR = "1",
  SUCCESS = "0"
}
