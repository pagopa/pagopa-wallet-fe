/* eslint-disable functional/no-let */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { toError } from "fp-ts/lib/Either";
import { WalletFieldsResponse } from "../../../generated/definitions/webview-payment-wallet/WalletFieldsResponse";
import { WalletId } from "../../../generated/definitions/webview-payment-wallet/WalletId";
import { ErrorsType } from "../errors/errorsModel";
import { apiWalletClient } from "./client";

export const npgSessionsFields = async (
  bearer: string,
  walletId: WalletId,
  onError: (e: string) => void,
  onResponse: (data: WalletFieldsResponse) => void
) =>
  await pipe(
    TE.tryCatch(
      () =>
        apiWalletClient.getWalletFieldsById({
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
