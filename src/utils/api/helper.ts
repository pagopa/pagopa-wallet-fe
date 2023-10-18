/* eslint-disable functional/no-let */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { CreateSessionResponse } from "../../../generated/definitions/payment-ecommerce/CreateSessionResponse";
import { apiPaymentEcommerceClientWithRetry } from "./client";

export const npgSessionsFields = async (
  onError: (e: string) => void,
  onResponse: (data: CreateSessionResponse) => void
) =>
  await pipe(
    TE.tryCatch(
      () =>
        apiPaymentEcommerceClientWithRetry.createSession({
          id: "e7058cac-5e1a-4002-8994-5bab31e9f385",
          recaptchaResponse: "atoken"
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
