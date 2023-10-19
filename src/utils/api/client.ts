import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { createClient as createWalletClient } from "../../../generated/definitions/webview-payment-wallet/client";
import { retryingFetch } from "../config/fetch";
import { getConfigOrThrow } from "../../config";

const conf = getConfigOrThrow();

/**
 * Api client for payment wallet API V1
 */
export const apiWalletClient = createWalletClient({
  baseUrl: conf.WALLET_CONFIG_API_HOST,
  basePath: conf.WALLET_CONFIG_API_BASEPATH as string,
  fetchApi: retryingFetch(
    fetch,
    conf.WALLET_CONFIG_API_TIMEOUT as Millisecond,
    3
  )
});
