import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { DeferredPromise } from "@pagopa/ts-commons//lib/promises";
import { createClient as createEcommerceClient } from "../../../generated/definitions/payment-ecommerce/client";
import { constantPollingWithPromisePredicateFetch } from "../config/fetch";
import { getConfigOrThrow } from "../../config";

const conf = getConfigOrThrow();
const retries: number = 10;
const delay: number = 1000;

/**
 * Api client for ecommerce API calculate fee with retry execution
 */
export const apiPaymentEcommerceClientWithRetry = createEcommerceClient({
  baseUrl: conf.WALLET_ECOMMERCE_HOST,
  basePath: conf.WALLET_API_ECOMMERCE_BASEPATH as string,
  fetchApi: constantPollingWithPromisePredicateFetch(
    DeferredPromise<boolean>().e1,
    retries,
    delay,
    conf.WALLET_CONFIG_API_TIMEOUT as Millisecond,
    async (r: Response): Promise<boolean> => r.status !== 200
  )
});
