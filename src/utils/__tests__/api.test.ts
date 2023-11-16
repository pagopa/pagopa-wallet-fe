/* eslint-disable functional/immutable-data */
/* eslint-disable no-underscore-dangle */
(window as any)._env_ = {
  WALLET_CONFIG_API_BASEPATH: "/webview-payment-wallet/v1",
  WALLET_CONFIG_API_PM_BASEPATH: "/pp-restapi-CD",
  WALLET_OUTCOME_API_BASEPATH: "/payment-wallet",
  WALLET_CONFIG_API_TIMEOUT: "10000",
  WALLET_CONFIG_API_ENV: "DEV",
  WALLET_CONFIG_API_HOST: "https://api.dev.platform.pagopa.it",
  WALLET_CONFIG_WEBVIEW_PM_HOST: "https://api.dev.platform.pagopa.it",
  WALLET_NPG_SDK_URL:
    "https://stg-ta.nexigroup.com/monetaweb/resources/hfsdk.js"
};
import * as O from "fp-ts/Option";
import pm from "../api/pm";
import { ErrorsType } from "../errors/errorsModel";
import {
  walletRequest,
  sessionToken,
  idWallet,
  walletResponseBody,
  bpayListItems,
  walletItems
} from "../testUtils";
import "whatwg-fetch";
import "jest-location-mock";

describe("Credit Card: add to the wallet", () => {
  it("should call onError callback function passing a GENERIC_ERROR when the fetch promise rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.creditCard.addWallet(
      sessionToken,
      walletRequest,
      onSucces,
      onError
    );
    expect(onSucces).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it("should call onError callback function passing a GENERIC_ERROR on 5xx type response", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.creditCard.addWallet(
      sessionToken,
      walletRequest,
      onSucces,
      onError
    );
    expect(onSucces).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith(ErrorsType.GENERIC_ERROR);
  });

  it("should call onSucces callback function passing the idWallet parameter on 2xx type response", async () => {
    const response = new Response(walletResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.creditCard.addWallet(
      sessionToken,
      walletRequest,
      onSucces,
      onError
    );
    expect(onSucces).toHaveBeenCalledWith(idWallet);
    expect(onError).not.toBeCalled();
  });

  it("should change the location and include outcome=1 on 4xx type response", async () => {
    const response = new Response(null, { status: 404 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.creditCard.addWallet(
      sessionToken,
      walletRequest,
      onSucces,
      onError
    );
    expect(onSucces).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(global.location.href).toContain("outcome=1");
  });

  it("should change the location and include outcome=14 on 401 type response", async () => {
    const response = new Response(null, { status: 401 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSucces = jest.fn();
    await pm.addWallet(sessionToken, walletRequest, onSucces, onError);
    expect(onSucces).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(global.location.href).toContain("outcome=14");
  });
});

describe("Bancomat Pay: getting the list", () => {
  it("should fails when http !== 200", async () => {
    const response = new Response(null, { status: 201 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(O.none);
  });

  it("should fails when http === 200 but no bpay item", async () => {
    const response = new Response(JSON.stringify({ data: [] }), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(O.none);
  });

  it("should fails when http === 200 but no data", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(O.none);
  });

  it("should success when http === 200 and data", async () => {
    const response = new Response(JSON.stringify({ data: bpayListItems }), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(O.some(bpayListItems));
  });
});

describe("Bancomat Pay: add wallet", () => {
  it("should success when http === 200", async () => {
    const response = new Response(JSON.stringify(walletItems), { status: 200 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.addWallet(sessionToken, bpayListItems);
    expect(result).toEqual(O.some(walletItems.data));
  });
});
