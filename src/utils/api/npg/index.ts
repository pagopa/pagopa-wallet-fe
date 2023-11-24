import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { IResponseType } from "@pagopa/ts-commons/lib/requests";
import { createClient as createWalletClient } from "../../../../generated/definitions/webview-payment-wallet/client";
import { WalletId } from "../../../../generated/definitions/webview-payment-wallet/WalletId";
import { getConfigOrThrow } from "../../../config";
import config from "../config";
import { ErrorsType } from "../../errors/errorsModel";
import { SessionWalletCreateResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { WalletVerifyRequestsResponse } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestsResponse";
import api from "..";
import utils from "../..";

const {
  WALLET_CONFIG_API_ENV,
  WALLET_CONFIG_API_HOST,
  WALLET_CONFIG_API_BASEPATH
} = getConfigOrThrow();

const apiWalletClient = createWalletClient({
  baseUrl:
    WALLET_CONFIG_API_ENV === "development" ? "" : WALLET_CONFIG_API_HOST,
  basePath: WALLET_CONFIG_API_BASEPATH,
  fetchApi: config.fetchWithTimeout
});

const sessionsFields = (
  bearerAuth: string,
  walletId: WalletId
): Promise<E.Either<ErrorsType, SessionWalletCreateResponse>> =>
  api.utils.validateApi(
    () =>
      apiWalletClient.createSessionWallet({
        walletId,
        bearerAuth
      }),
    (response) =>
      api.utils.matchApiStatus(
        response as IResponseType<number, SessionWalletCreateResponse, string>,
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
                    () => E.right(response.value as SessionWalletCreateResponse)
                  )
                )
            )
          )
      )
  );

const validations = async (
  bearerAuth: string,
  orderId: string,
  walletId: WalletId
): Promise<E.Either<ErrorsType, WalletVerifyRequestsResponse>> =>
  api.utils.validateApi(
    () =>
      apiWalletClient.postWalletValidations({
        orderId,
        bearerAuth,
        walletId
      }),
    (response) =>
      api.utils.matchApiStatus(
        response as IResponseType<number, SessionWalletCreateResponse, string>,
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

export const npg = {
  sessionsFields,
  validations
};
