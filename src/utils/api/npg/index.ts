import * as E from "fp-ts/Either";
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
import { SessionWalletRetrieveResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletRetrieveResponse";
import { BundleOption } from "../../../../generated/definitions/webview-payment-wallet/BundleOption";
import { SessionInputData } from "../../../../generated/definitions/webview-payment-wallet/SessionInputData";

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

const createSessionWallet =
  (client: WalletClient) =>
  (
    bearerAuth: string,
    walletId: WalletId,
    body: SessionInputData
  ): Promise<E.Either<ErrorsType, SessionWalletCreateResponse>> =>
    api.utils.validateApi(
      () =>
        client.createSessionWallet({
          walletId,
          bearerAuth,
          body
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
              E.match(() => E.left(ErrorsType.GENERIC_ERROR), E.right)
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

const getPspsForWallet =
  (client: WalletClient) => async (walletId: string, walletToken: string) =>
    api.utils.validateApi(
      () => client.getPspsForWallet({ walletId, bearerAuth: walletToken }),
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
  /**
   *  returns fields when the method is credit cards
   *  returns redirect url when method is apm
   */
  createSessionWallet: createSessionWallet(apiWalletClientWithoutPolling),
  validations: validations(apiWalletClientWithoutPolling),
  getSessionWallet: getSessionWallet(
    apiWalletClientWithPolling(async (r) => {
      const { isFinalOutcome } = (await r
        .clone() // this is becuase you only can consume Response.json() once
        .json()) as SessionWalletRetrieveResponse;
      return r.status !== 200 || !isFinalOutcome;
    })
  ),
  getPspsForWallet: getPspsForWallet(apiWalletClientWithoutPolling)
};
