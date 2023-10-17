import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { createClient as createPaymentManagerClient } from "../../../../generated/definitions/payment-manager-v1/client";
import { WalletRequest } from "../../../../generated/definitions/payment-manager-v1/WalletRequest";
import config from "../config";
import { ErrorsType } from "../../errors/errorsModel";
import { getConfigOrThrow } from "../../../config";
import utils from "../../";

const NODE_ENV = getConfigOrThrow().WALLET_CONFIG_API_ENV;
const API_HOST = getConfigOrThrow().WALLET_CONFIG_API_HOST;
const API_PM_BASEPATH = getConfigOrThrow().WALLET_CONFIG_API_PM_BASEPATH;

/**
 * Api client for payment manager API
 */
const paymentManagerClient = createPaymentManagerClient({
  baseUrl: NODE_ENV === "development" ? "" : API_HOST,
  basePath: API_PM_BASEPATH,
  fetchApi: config.fetchWithTimeout
});

const addWallet = async (
  bearer: string,
  walletRequest: WalletRequest,
  onSuccess: (idWallet: number) => void,
  onError: (error: ErrorsType) => void
) =>
  await pipe(
    TE.tryCatch(
      () =>
        paymentManagerClient.addWalletCreditCardUsingPOST({
          Bearer: "Bearer " + bearer,
          walletRequest
        }),
      (_error) => toError
    ),
    TE.fold(
      () => async () => onError(ErrorsType.GENERIC_ERROR), // When the promise rejects
      (resp) => async () =>
        pipe(
          resp,
          E.fold(
            (_errors) => onError(ErrorsType.GENERIC_ERROR), // When errors
            ({ status, value }) => {
              pipe(
                status,
                utils.validators.evaluateHTTPfamilyStatusCode,
                O.match(
                  () => onError(ErrorsType.GENERIC_ERROR),
                  utils.validators.matchHttpFamilyResponseStatusCode(
                    {
                      "2xx": () => {
                        const idWallet = value?.data?.idWallet;
                        return idWallet
                          ? onSuccess(idWallet)
                          : onError(ErrorsType.GENERIC_ERROR);
                      },
                      "4xx": () =>
                        // eslint-disable-next-line functional/immutable-data
                        (window.location.href = `${API_HOST}${API_PM_BASEPATH}/v3/webview/logout/bye?outcome=0`)
                    },
                    () => onError(ErrorsType.GENERIC_ERROR)
                  )
                )
              );
            }
          )
        )
    )
  )();

export default {
  addWallet
};
