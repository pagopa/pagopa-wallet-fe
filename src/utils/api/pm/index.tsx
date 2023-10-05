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

const addWallet = async (Bearer: string, walletRequest: WalletRequest) => {
  await paymentManagerClient.addWalletCreditCardUsingPOST({
    Bearer,
    walletRequest
  });
};

export default {
  addWallet
};
