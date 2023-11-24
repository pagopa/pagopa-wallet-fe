import * as E from "fp-ts/Either";
import { createClient as createPaymentManagerClient } from "../../../../generated/definitions/payment-manager-v1/client";
import config from "../config";
import { ErrorsType } from "../../errors/errorsModel";
import { getConfigOrThrow } from "../../../config";
import { PaypalPspListResponse } from "../../../../generated/definitions/payment-manager-v1/PaypalPspListResponse";
import api from "..";

const { WALLET_CONFIG_WEBVIEW_PM_HOST, WALLET_CONFIG_API_PM_BASEPATH } =
  getConfigOrThrow();

/**
 * Api client for payment manager API
 */
const paymentManagerClient = createPaymentManagerClient({
  baseUrl: WALLET_CONFIG_WEBVIEW_PM_HOST,
  basePath: WALLET_CONFIG_API_PM_BASEPATH,
  fetchApi: config.fetchWithTimeout
});

export const getPaypalPsps = async (
  bearer: string,
  language?: string
): Promise<E.Either<ErrorsType, PaypalPspListResponse>> =>
  api.utils.validateApi(
    () =>
      paymentManagerClient.getPaypalPspsUsingGET({
        language,
        Bearer: "Bearer " + bearer
      }),
    (response) =>
      api.utils.matchApiStatus(response, () =>
        response.value?.data?.length
          ? E.right(response.value)
          : E.left(ErrorsType.GENERIC_ERROR)
      )
  );
