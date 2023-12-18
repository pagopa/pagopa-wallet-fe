import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { IResponseType } from "@pagopa/ts-commons/lib/requests";
import {
  Client as WalletClient,
  createClient as createWalletClient
} from "../../../../generated/definitions/webview-payment-wallet/client";
import { WalletId } from "../../../../generated/definitions/webview-payment-wallet/WalletId";
import { getConfigOrThrow } from "../../../config";
import { OrderId } from "../../../../generated/definitions/webview-payment-wallet/OrderId";
import config from "../config";
import { ErrorsType } from "../../errors/errorsModel";
import { SessionWalletCreateResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { WalletVerifyRequestsResponse } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestsResponse";
import api from "..";
import utils from "../..";
import { SessionWalletRetrieveResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletRetrieveResponse";
import { BundleOption } from "../../../../generated/definitions/webview-payment-wallet/BundleOption";

const {
  WALLET_CONFIG_API_ENV,
  WALLET_CONFIG_API_HOST,
  WALLET_CONFIG_API_BASEPATH
} = getConfigOrThrow();

/** this works in conjunction with the proxy server for the local development environment
 *  see the .proxyrc.js file
 */
const baseUrl = WALLET_CONFIG_API_ENV === "DEV" ? "" : WALLET_CONFIG_API_HOST;

const apiWalletClientWithoutPolling: WalletClient = createWalletClient({
  baseUrl,
  basePath: WALLET_CONFIG_API_BASEPATH,
  fetchApi: config.fetchWithTimeout
});

const apiWalletClientWithPolling = (
  condition: (r: Response) => Promise<boolean>
): WalletClient =>
  createWalletClient({
    baseUrl,
    fetchApi: config.retryingFetch(condition),
    basePath: WALLET_CONFIG_API_BASEPATH
  });

const sessionsFields =
  (client: WalletClient) =>
  (
    bearerAuth: string,
    walletId: WalletId
  ): Promise<E.Either<ErrorsType, SessionWalletCreateResponse>> =>
    api.utils.validateApi(
      () =>
        client.createSessionWallet({
          walletId,
          bearerAuth
        }),
      (response) =>
        api.utils.matchApiStatus(
          response as IResponseType<
            number,
            SessionWalletCreateResponse,
            string
          >,
          () =>
            pipe(
              response.value,
              SessionWalletCreateResponse.decode,
              E.match(
                () => E.left(ErrorsType.GENERIC_ERROR),
                (decoded) =>
                  pipe(
                    decoded.cardFormFields,
                    utils.validators.validateSessionWalletCardFormFields,
                    O.match(
                      () => E.left(ErrorsType.GENERIC_ERROR),
                      () =>
                        E.right(response.value as SessionWalletCreateResponse)
                    )
                  )
              )
            )
        )
    );

const validations =
  (client: WalletClient) =>
  async (
    bearerAuth: string,
    orderId: string,
    walletId: WalletId
  ): Promise<E.Either<ErrorsType, WalletVerifyRequestsResponse>> =>
    api.utils.validateApi(
      () =>
        client.postWalletValidations({
          orderId,
          bearerAuth,
          walletId
        }),
      (response) =>
        api.utils.matchApiStatus(
          response as IResponseType<
            number,
            SessionWalletCreateResponse,
            string
          >,
          () =>
            pipe(
              response.value,
              WalletVerifyRequestsResponse.decode,
              E.match(
                () => E.left(ErrorsType.GENERIC_ERROR),
                (decoded) => E.right(decoded)
              )
            )
        )
    );

const getSessionWallet =
  (client: WalletClient) =>
  async (
    walletId: WalletId,
    orderId: OrderId,
    bearerAuth: string
  ): Promise<E.Either<ErrorsType, SessionWalletRetrieveResponse>> =>
    api.utils.validateApi(
      () =>
        client.getSessionWallet({
          bearerAuth,
          walletId,
          orderId
        }),
      (response) =>
        api.utils.matchApiStatus(
          response as IResponseType<
            number,
            SessionWalletRetrieveResponse,
            string
          >,
          () =>
            pipe(
              response.value,
              SessionWalletRetrieveResponse.decode,
              E.match(
                () => E.left(ErrorsType.GENERIC_ERROR),
                (decoded) => E.right(decoded)
              )
            )
        )
    );

const getPspsForPaymentMethod =
  (client: WalletClient) => async (paymentMethodId: string) =>
    api.utils.validateApi(
      () => client.getPspsForPaymentMethod({ paymentMethodId }),
      (resposne) =>
        api.utils.matchApiStatus(resposne, () =>
          pipe(
            resposne.value,
            BundleOption.decode,
            E.match(
              () => E.left(ErrorsType.GENERIC_ERROR),
              (decoded) => E.right(decoded)
            )
          )
        )
    );

export default {
  creditCard: {
    sessionsFields: sessionsFields(apiWalletClientWithoutPolling),
    validations: validations(apiWalletClientWithoutPolling),
    getSessionWallet: getSessionWallet(
      apiWalletClientWithPolling(async (r) => {
        const { isFinalOutcome } = (await r
          .clone() // this is becuase you only can consume Response.json() once
          .json()) as SessionWalletRetrieveResponse;
        return r.status !== 200 || !isFinalOutcome;
      })
    )
  },
  apm: {
    getPspsForPaymentMethod: getPspsForPaymentMethod(
      apiWalletClientWithoutPolling
    )
  }
};
