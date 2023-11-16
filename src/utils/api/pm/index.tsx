import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { trackPromise } from "react-promise-tracker";
import { createClient as createPaymentManagerClient } from "../../../../generated/definitions/payment-manager-v1/client";
import { WalletRequest } from "../../../../generated/definitions/payment-manager-v1/WalletRequest";
import config from "../config";
import { ErrorsType } from "../../errors/errorsModel";
import { getConfigOrThrow } from "../../../config";
import utils from "../../";
import { RestBPayResponse } from "../../../../generated/definitions/payment-manager-v1/RestBPayResponse";

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
                        utils.url.redirectWithOutcame(outcome);
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
 */
const getBpayList = async (
  sessionToken: string
): Promise<O.Option<Exclude<RestBPayResponse["data"], undefined>>> =>
  await trackPromise(
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
              () => O.none, // When errors, like decode errors
              ({ status, value }) =>
                status === 200 ? O.some(value.data || []) : O.none
            )
          )
      )
    )(),
    "page-container"
  );

const addWalletsBPay = async (sessionToken: string, bpayItem: any) =>
  await trackPromise(
    pipe(
      TE.tryCatch(
        () =>
          paymentManagerClient.addWalletsBPayUsingPOST({
            Bearer: "Bearer " + sessionToken,
            bPayRequest: {
              data: bpayItem
            }
          }),
        () => toError
      ),
      TE.match(
        () => O.none,
        (response) =>
          pipe(
            response,
            E.match(
              (_errors) => {
                // eslint-disable-next-line
              console.error(_errors);
                return O.none;
              },
              ({ status, value }) =>
                status === 200 ? O.some(value.data) : O.none
            )
          )
      )
    )(),
    "page-container"
  );

export default {
  creditCard: {
    addWallet: addWalletCreditCard
  },
  bPay: {
    getList: getBpayList,
    addWallet: addWalletsBPay
  }
};
