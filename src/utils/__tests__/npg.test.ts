/* eslint-disable functional/immutable-data */
// eslint-disable-next-line no-underscore-dangle
(window as any)._env_ = {
  WALLET_CONFIG_API_BASEPATH: "/webview-payment-wallet/v1",
  WALLET_CONFIG_API_PM_BASEPATH: "/pp-restapi-CD",
  WALLET_CONFIG_API_TIMEOUT: "10000",
  WALLET_CONFIG_API_ENV: "DEV",
  WALLET_CONFIG_API_HOST: "https://api.dev.platform.pagopa.it",
  WALLET_NPG_SDK_URL:
    "https://stg-ta.nexigroup.com/monetaweb/resources/hfsdk.js"
};

import { npg } from "../api/npg";
import { ErrorsType } from "../errors/errorsModel";
import {
  npgSessionFieldsResponse,
  npgSessionFieldsResponseBody,
  orderId,
  sessionToken,
  walletId,
  walletValidationsResponse,
  walletValidationsResponseBody
} from "./utils";
import "whatwg-fetch";
import "jest-location-mock";

describe("get card form fields", () => {
  it("should call onError callback function passing a GENERIC_ERROR when the fetch promise rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onSucces = jest.fn();
    await npg.sessionsFields(sessionToken, walletId, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it("should call onError callback function passing a GENERIC_ERROR on 500 status code", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await npg.sessionsFields(sessionToken, walletId, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it("should call onSucces callback function passing the response data on 200 status code", async () => {
    const response = new Response(npgSessionFieldsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await npg.sessionsFields(sessionToken, walletId, onSucces, onError);
    expect(onSucces).toHaveBeenCalledWith(npgSessionFieldsResponse);
    expect(onError).not.toBeCalled();
  });
});

describe("validate card data fields", () => {
  it("should call onError callback function passing a GENERIC_ERROR when the fetch promise rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onResponse = jest.fn();
    await npg.validations({
      sessionToken,
      walletId,
      orderId,
      onResponse,
      onError
    });
    expect(onResponse).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it.skip("should call onError callback function passing a GENERIC_ERROR on 500 status code", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onResponse = jest.fn();
    await npg.validations({
      sessionToken,
      walletId,
      orderId,
      onResponse,
      onError
    });
    expect(onResponse).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it("should call onResponse callback function passing the response data on 200 status code", async () => {
    const response = new Response(walletValidationsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onResponse = jest.fn();
    await npg.validations({
      sessionToken,
      walletId,
      orderId,
      onResponse,
      onError
    });
    expect(onResponse).toHaveBeenCalledWith(walletValidationsResponse);
    expect(onError).not.toBeCalled();
  });
});
