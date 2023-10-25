/* eslint-disable functional/no-let */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { toError } from "fp-ts/lib/Either";
import { SessionWalletCreateResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { createClient as createWalletClient } from "../../../../generated/definitions/webview-payment-wallet/client";
import { WalletId } from "../../../../generated/definitions/webview-payment-wallet/WalletId";
import { WalletVerifyRequestsResponse } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestsResponse";
import { ErrorsType } from "../../errors/errorsModel";
import { getConfigOrThrow } from "../../../config";
import config from "../config";

const NODE_ENV = getConfigOrThrow().WALLET_CONFIG_API_ENV;
const WALLET_CONFIG_API_HOST = getConfigOrThrow().WALLET_CONFIG_API_HOST;
const WALLET_CONFIG_API_BASEPATH =
  getConfigOrThrow().WALLET_CONFIG_API_BASEPATH;

const apiWalletClient = createWalletClient({
  baseUrl: NODE_ENV === "development" ? "" : WALLET_CONFIG_API_HOST,
  basePath: WALLET_CONFIG_API_BASEPATH as string,
  fetchApi: config.fetchWithTimeout
});

const sessionsFields = async (
  bearer: string,
  walletId: WalletId,
  onResponse: (data: SessionWalletCreateResponse) => void,
  onError: (e: string) => void
) =>
  await pipe(
    TE.tryCatch(
      () =>
        apiWalletClient.createSessionWallet({
          walletId,
          bearerAuth: bearer
        }),
      (_e) => toError
    ),
    TE.fold(
      (err) => {
        onError(ErrorsType.GENERIC_ERROR);
        return TE.left(err);
      },
      (myResExt) => async () =>
        pipe(
          myResExt,
          E.fold(
            () => ({}),
            (myRes) => {
              if (myRes.status === 200) {
                onResponse(myRes.value);
                return myRes;
              } else {
                return {};
              }
            }
          )
        )
    )
  )();

const validations = async ({
  sessionToken: bearerAuth,
  orderId,
  walletId,
  onResponse,
  onError
}: {
  sessionToken: string;
  orderId: string;
  walletId: WalletId;
  onResponse: (data: WalletVerifyRequestsResponse) => void;
  onError: (e: string) => void;
}) =>
  await pipe(
    TE.tryCatch(
      () =>
        apiWalletClient.postWalletValidations({
          orderId,
          bearerAuth,
          walletId
        }),
      (_e) => toError
    ),
    TE.fold(
      (err) => {
        onError(ErrorsType.GENERIC_ERROR);
        return TE.left(err);
      },
      (myResExt) => async () =>
        pipe(
          myResExt,
          E.fold(
            () => ({}),
            (myRes) => {
              if (myRes.status === 200) {
                onResponse(myRes.value);
                return myRes;
              } else {
                return {};
              }
            }
          )
        )
    )
  )();

export const npg = {
  validations,
  sessionsFields
};
