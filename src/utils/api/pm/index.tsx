import * as E from "fp-ts/Either";
import { WalletRequest } from "../../../../generated/definitions/payment-manager-v1/WalletRequest";
import { createClient as createPaymentManagerClient } from "../../../../generated/definitions/payment-manager-v1/client";
import { getConfigOrThrow } from "../../../config";
import { IBpayAccountItems } from "../../../features/onboard/models";
import { ErrorsType } from "../../errors/errorsModel";
import config from "../config";
import api from "..";
import { getPaypalPsps } from "./paypal";

const {
  WALLET_CONFIG_API_ENV,
  WALLET_CONFIG_API_HOST,
  WALLET_CONFIG_API_PM_BASEPATH
} = getConfigOrThrow();

/**
 * Api client for payment manager API
 */
const paymentManagerClient = createPaymentManagerClient({
  baseUrl:
    WALLET_CONFIG_API_ENV === "development" ? "" : WALLET_CONFIG_API_HOST,
  basePath: WALLET_CONFIG_API_PM_BASEPATH,
  fetchApi: config.fetchWithTimeout
});

const addWalletCreditCard = async (
  bearer: string,
  walletRequest: WalletRequest
): Promise<E.Either<ErrorsType, number>> =>
  api.utils.validateApi(
    () =>
      paymentManagerClient.addWalletCreditCardUsingPOST({
        Bearer: "Bearer " + bearer,
        walletRequest
      }),
    (response) =>
      api.utils.matchApiStatus(response, () => {
        const idWallet = response.value?.data?.idWallet;
        if (idWallet) {
          return E.right(idWallet);
        } else {
          return E.left(ErrorsType.GENERIC_ERROR);
        }
      })
  );

/**
 * returns Bancomat Pay account items of the user identified by the sessionToken parameter
 */
const getBpayList = async (
  sessionToken: string
): Promise<E.Either<ErrorsType, IBpayAccountItems>> =>
  api.utils.validateApi(
    () =>
      paymentManagerClient.getBpayListUsingGET({
        Bearer: "Bearer " + sessionToken
      }),
    (response) =>
      api.utils.matchApiStatus(response, () => {
        const { value, status } = response;
        if (status === 200 && value?.data !== undefined) {
          return E.right(value.data);
        } else {
          return E.left(ErrorsType.GENERIC_ERROR);
        }
      })
  );

/**
 * adds Bancomat Pay account items to the user wallet
 */
const addWalletsBPay = async (
  sessionToken: string,
  bPayAccountItems: IBpayAccountItems
) =>
  api.utils.validateApi(
    () =>
      paymentManagerClient.addWalletsBPayUsingPOST({
        Bearer: "Bearer " + sessionToken,
        bPayRequest: {
          data: bPayAccountItems
        }
      }),
    (response) =>
      api.utils.matchApiStatus(response, () => {
        const { value } = response;
        return value?.data
          ? E.right(value.data)
          : E.left(ErrorsType.GENERIC_ERROR);
      })
  );

export default {
  creditCard: {
    addWallet: addWalletCreditCard
  },
  bPay: {
    getList: getBpayList,
    addWallet: addWalletsBPay
  },
  paypal: {
    getPaypalPsps
  }
};
