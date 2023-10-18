/* eslint-disable no-underscore-dangle */
/* eslint-disable functional/immutable-data */
(window as any)._env_ = {
  WALLET_CONFIG_API_BASEPATH: "/webview-payment-wallet/v1",
  WALLET_CONFIG_API_PM_BASEPATH: "/pp-restapi-CD",
  WALLET_CONFIG_API_TIMEOUT: "10000",
  WALLET_CONFIG_API_ENV: "DEV",
  WALLET_CONFIG_API_HOST: "https://api.dev.platform.pagopa.it"
};
import { TypeEnum } from "../../../generated/definitions/payment-manager-v1/Wallet";
import api from "../api";

const request = {
  data: {
    creditCard: {
      holder: "Pippo Baudo",
      securityCode: "123",
      pan: "4242424242424242",
      expireMonth: "11",
      expireYear: "23"
    },
    type: TypeEnum.CREDIT_CARD
  }
};

// const response = {
//   status: 200,
//   value: {
//     data: {
//       idWallet: 1222302,
//       type: "CREDIT_CARD",
//       favourite: false,
//       creditCard: {
//         id: 1157851,
//         holder: "a b",
//         pan: "************4242",
//         expireMonth: "01",
//         expireYear: "32",
//         brandLogo:
//           "https://api.dev.platform.pagopa.it/wallet/assets/img/creditcard/generic.png",
//         flag3dsVerified: false,
//         brand: "OTHER",
//         isOnUs: false,
//         hasAlreadyPaid: false,
//         onlyOnUs: false,
//         flagForwardCreateToTkm: false,
//         flagForwardDeleteToTkm: false
//       },
//       pspEditable: true,
//       onboardingChannel: "IO",
//       services: ["pagoPA", "BPD", "FA"],
//       isPspToIgnore: false,
//       registeredNexi: false,
//       pagoPa: true,
//       saved: false
//     }
//   }
// };

describe("add wallet", () => {
  it("should call onError callback function when the promise rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onSucces = jest.fn();
    await api.addWallet("token", request, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).toBeCalled();
  });

  it("should call onError callback function server error 5xx", async () => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({ status: 500 }));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await api.addWallet("token", request, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).toBeCalled();
  });
});
