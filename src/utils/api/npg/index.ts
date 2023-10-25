/* eslint-disable functional/no-let */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { toError } from "fp-ts/lib/Either";
import { SessionWalletCreateResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { WalletId } from "../../../../generated/definitions/webview-payment-wallet/WalletId";
import { WalletVerifyRequestsResponse } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestsResponse";
import { ErrorsType } from "../../errors/errorsModel";
import { apiWalletClient } from "../client";

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
