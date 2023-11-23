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
import { IBpayAccountItems } from "../../../features/onboard/models";
import { getPaypalPsps } from "./paypal";

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

const addWalletCreditCard = async (
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
                      "4xx": () => {
                        const outcome = status === 401 ? 14 : 1;
                        utils.url.redirectWithOutcome(outcome);
                      }
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

/**
 * returns Bancomat Pay account items of the user idenfied by the sessionToken parameter
 * returns an instance of O.none when no accounts are returned
 */
const getBpayList = async (
  sessionToken: string
): Promise<O.Option<IBpayAccountItems>> =>
  pipe(
    TE.tryCatch(
      () =>
        paymentManagerClient.getBpayListUsingGET({
          Bearer: "Bearer " + sessionToken
        }),
      () => toError
    ),
    TE.match(
      () => O.none, // When promise rejects
      (resp) =>
        pipe(
          resp,
          E.match(
            (_errors) => O.none, // When errors, like decode errors
            ({ status, value }) =>
              status === 200 && value.data && value.data.length > 0
                ? O.some(value.data)
                : O.none
          )
        )
    )
  )();

/**
 * adds Bancomat Pay account items to the user wallet
 */
const addWalletsBPay = async (
  sessionToken: string,
  bPayAccountItems: IBpayAccountItems
) =>
  pipe(
    TE.tryCatch(
      () =>
        paymentManagerClient.addWalletsBPayUsingPOST({
          Bearer: "Bearer " + sessionToken,
          bPayRequest: {
            data: bPayAccountItems
          }
        }),
      () => toError
    ),
    TE.match(
      () => O.none, // When promise rejects
      (response) =>
        pipe(
          response,
          E.match(
            (_errors) => O.none, // When errors, like decode errors
            ({ status, value }) =>
              status === 200 ? O.some(value.data) : O.none
          )
        )
    )
  )();

export default {
  creditCard: {
    addWallet: addWalletCreditCard
  },
  bPay: {
    getList: getBpayList,
    addWallet: addWalletsBPay
  },
  paypal: {
    getPaypalPsps
  }
};
