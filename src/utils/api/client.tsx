import { createClient as createEcommerceClient } from "../../../generated/definitions/payment-ecommerce/client";

const { API_HOST = "", API_BASEPATH, NODE_ENV } = process.env;

/**
 * Api client for payment ecommerce API
 */
export const apiPaymentEcommerceClient = createEcommerceClient({
  baseUrl: NODE_ENV === "development" ? "" : API_HOST,
  basePath: API_BASEPATH,
  fetchApi: fetch
});
