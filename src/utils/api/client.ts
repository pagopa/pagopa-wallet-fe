import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { createClient as createEcommerceClient } from "../../../generated/definitions/payment-ecommerce/client";
import { getConfigOrThrow } from "../config/config";
import { retryingFetch } from "../config/fetch";

const conf = getConfigOrThrow();
/**
 * Api client for payment ecommerce API
 */
export const apiPaymentEcommerceClient = createEcommerceClient({
  baseUrl: conf.CHECKOUT_ECOMMERCE_HOST,
  basePath: conf.CHECKOUT_API_ECOMMERCE_BASEPATH as string,
  fetchApi: retryingFetch(fetch, conf.CHECKOUT_API_TIMEOUT as Millisecond, 3),
});
