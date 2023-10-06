import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { createClient as createPaymentManagerClient } from "../../../../generated/definitions/payment-manager-v1/client";
import { WalletRequest } from "../../../../generated/definitions/payment-manager-v1/WalletRequest";
import env from "../../env";

const { NODE_ENV, API_HOST = "", API_PM_BASEPATH } = env;

/**
 * Api client for payment manager API
 */
const paymentManagerClient = createPaymentManagerClient({
  baseUrl: NODE_ENV === "development" ? "" : API_HOST,
  basePath: API_PM_BASEPATH,
  fetchApi: fetch
});

const addWallet = async (bearer: string, walletRequest: WalletRequest) =>
  pipe(
    await paymentManagerClient.addWalletCreditCardUsingPOST({
      Bearer: "Bearer " + bearer,
      walletRequest
    }),
    E.fold(
      () => null,
      (resp) => resp
    )
  );

export default {
  addWallet
};
