/* eslint-disable functional/immutable-data */
/* eslint-disable no-underscore-dangle */
(window as any)._env_ = {
  WALLET_CONFIG_API_BASEPATH: "/webview-payment-wallet/v1",
  WALLET_CONFIG_API_PM_BASEPATH: "/pp-restapi-CD",
  WALLET_CONFIG_API_TIMEOUT: "10000",
  WALLET_CONFIG_API_ENV: "DEV",
  WALLET_CONFIG_API_HOST: "https://api.dev.platform.pagopa.it"
};
import pm from "../api/pm";
import { ErrorsType } from "../errors/errorsModel";
import {
  walletRequest,
  sessionToken,
  idWallet,
  walletResponseBody
} from "./utils";
import "whatwg-fetch";
import "jest-location-mock";

describe("add wallet", () => {
  it("should call onError callback function when the promise rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.addWallet(sessionToken, walletRequest, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it("should call onError callback function server error 5xx", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.addWallet(sessionToken, walletRequest, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it("should call onSucces callback function on 2xx response passing the idWallet parameters", async () => {
    const response = new Response(walletResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.addWallet(sessionToken, walletRequest, onSucces, onError);
    expect(onSucces).toHaveBeenCalledWith(idWallet);
    expect(onError).not.toBeCalled();
  });

  it("should call onError callback function server error 4xx", async () => {
    const response = new Response(null, { status: 404 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.addWallet(sessionToken, walletRequest, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(global.location.href).toContain("outcome=1");
  });
});
