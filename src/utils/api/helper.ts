/* eslint-disable functional/no-let */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { WalletFieldsResponse } from "../../../generated/definitions/webview-payment-wallet/WalletFieldsResponse";
import { apiWalletClient } from "./client";

export const npgSessionsFields = async (
  onError: (e: string) => void,
  onResponse: (data: WalletFieldsResponse) => void
) =>
  await pipe(
    TE.tryCatch(
      () =>
        apiWalletClient.getWalletFieldsById({
          walletId: "11111",
          bearerAuth: "atoken"
        }),
      (_e) => "err"
    ),
    TE.fold(
      (err) => {
        onError(err);
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
