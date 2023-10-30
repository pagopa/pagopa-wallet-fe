import { getConfigOrThrow } from "../../config";

const { WALLET_CONFIG_API_HOST, WALLET_CONFIG_API_BASEPATH } =
  getConfigOrThrow();

export enum WalletRoutes {
  ERRORE = "errore",
  ESITO = "esito",
  GDI_CHECK = "gdi-check",
  INSERISCI_CARTA = "onboarding",
  NPG_INSERISCI_CARTA = "npg-onboarding",
  ROOT = ""
}

export const EXTERNAL_OUTCOME = `${WALLET_CONFIG_API_HOST}${WALLET_CONFIG_API_BASEPATH}/v3/webview/logout/bye?outcome=`;

export enum NPG_OUTCOME_ROUTE {
  ERROR = "1",
  SUCCESS = "0"
}
