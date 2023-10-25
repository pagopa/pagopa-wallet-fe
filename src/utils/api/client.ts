import { createClient as createWalletClient } from "../../../generated/definitions/webview-payment-wallet/client";
import { getConfigOrThrow } from "../../config";
import config from "./config";

const NODE_ENV = getConfigOrThrow().WALLET_CONFIG_API_ENV;
const WALLET_CONFIG_API_HOST = getConfigOrThrow().WALLET_CONFIG_API_HOST;
const WALLET_CONFIG_API_BASEPATH =
  getConfigOrThrow().WALLET_CONFIG_API_BASEPATH;

/**
 * Api client for payment wallet API V1
 */
export const apiWalletClient = createWalletClient({
  baseUrl: NODE_ENV === "development" ? "" : WALLET_CONFIG_API_HOST,
  basePath: WALLET_CONFIG_API_BASEPATH as string,
  fetchApi: config.fetchWithTimeout
});
