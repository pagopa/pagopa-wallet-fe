import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { toError } from "fp-ts/lib/Either";
import { SessionWalletCreateResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { createClient as createWalletClient } from "../../../../generated/definitions/webview-payment-wallet/client";
import { WalletId } from "../../../../generated/definitions/webview-payment-wallet/WalletId";
import { WalletVerifyRequestsResponse } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestsResponse";
import { getConfigOrThrow } from "../../../config";
import config from "../config";
import utils from "../..";
import { useNpgOutcomeRedirect } from "../../../hooks/useNpgOutcomeRedirect";
import { NPG_OUTCOME_ROUTE } from "../../../routes/models/routeModel";

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

const errorRedirect = useNpgOutcomeRedirect(NPG_OUTCOME_ROUTE.ERROR);

const sessionsFields = async ({
  sessionToken: bearerAuth,
  walletId,
  onSuccess,
  onError
}: {
  sessionToken: string;
  walletId: WalletId;
  onSuccess: (data: SessionWalletCreateResponse) => void;
  onError: () => void;
}) =>
  await pipe(
    TE.tryCatch(
      () =>
        apiWalletClient.createSessionWallet({
          walletId,
          bearerAuth
        }),
      toError
    ),
    TE.fold(
      () => async () => onError(),
      (resp) => async () =>
        pipe(
          resp,
          E.fold(onError, ({ status, value }) => {
            pipe(
              status,
              utils.validators.evaluateHTTPfamilyStatusCode,
              O.match(
                onError,
                utils.validators.matchHttpFamilyResponseStatusCode(
                  {
                    "2xx": () => {
                      pipe(
                        SessionWalletCreateResponse.decode(value),
                        E.fold(onError, (data) => {
                          pipe(
                            data.cardFormFields,
                            utils.validators
                              .validateSessionWalletCardFormFields,
                            O.match(onError, (cardFormFields) =>
                              onSuccess({
                                orderId: data.orderId,
                                cardFormFields
                              })
                            )
                          );
                        })
                      );
                    },
                    "4xx": errorRedirect
                  },
                  onError
                )
              )
            );
          })
        )
    )
  )();

const validations = async ({
  sessionToken: bearerAuth,
  orderId,
  walletId,
  onSuccess,
  onError
}: {
  sessionToken: string;
  orderId: string;
  walletId: WalletId;
  onSuccess: (data: WalletVerifyRequestsResponse) => void;
  onError: () => void;
}) =>
  await pipe(
    TE.tryCatch(
      () =>
        apiWalletClient.postWalletValidations({
          orderId,
          bearerAuth,
          walletId
        }),
      toError
    ),
    TE.fold(
      () => async () => onError(),
      (validation) => async () =>
        pipe(
          validation,
          E.fold(onError, ({ status, value }) => {
            pipe(
              status,
              utils.validators.evaluateHTTPfamilyStatusCode,
              O.match(
                onError,
                utils.validators.matchHttpFamilyResponseStatusCode(
                  {
                    "2xx": () => {
                      if (value) {
                        pipe(
                          WalletVerifyRequestsResponse.decode(value),
                          E.fold(onError, onSuccess)
                        );
                      }
                    },
                    "4xx": errorRedirect
                  },
                  onError
                )
              )
            );
          })
        )
    )
  )();

export const npg = {
  validations,
  sessionsFields
};
