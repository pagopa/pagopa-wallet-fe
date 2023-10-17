import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { createClient as createPaymentManagerClient } from "../../../../generated/definitions/payment-manager-v1/client";
import { WalletRequest } from "../../../../generated/definitions/payment-manager-v1/WalletRequest";
import config from "../config";
import { ErrorsType } from "../../errors/errorsModel";
import { getConfigOrThrow } from "../../../config";

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
      (_e) => {
        onError(ErrorsType.GENERIC_ERROR);
        return toError;
      }
    ),
    TE.fold(
      (_e) => async () => onError(ErrorsType.GENERIC_ERROR),
      (resp) => async () =>
        pipe(
          resp,
          E.fold(
            () => onError(ErrorsType.GENERIC_ERROR),
            ({ status, value }) => {
              const idWallet = value?.data?.idWallet;
              if (status === 200 && idWallet) {
                onSuccess(idWallet);
              } else {
                onError(ErrorsType.GENERIC_ERROR);
              }
            }
          )
        )
    )
  )();

export default {
  addWallet
};
