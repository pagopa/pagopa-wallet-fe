/* eslint-disable functional/immutable-data */
// eslint-disable-next-line no-underscore-dangle
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

import { npg } from "../api/npg";
import {
  npgSessionFieldsResponse,
  npgSessionFieldsResponseBody,
  orderId,
  sessionToken,
  walletId,
  walletValidationsResponse,
  walletValidationsResponseBody
} from "../testUtils";
import "whatwg-fetch";
import "jest-location-mock";

describe("get card form fields", () => {
  it("should call onError callback when the fetch rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should call onError callback on 500 status code", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should change the location and include outcome=1 on 4xx type response", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(global.location.href).toContain("outcome=1");
  });

  it("should call onSuccess callback function passing the response data on 200 status code", async () => {
    const response = new Response(npgSessionFieldsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).toHaveBeenCalledWith(npgSessionFieldsResponse);
  });

  it("should call onError when the response is not conform: test a", async () => {
    const response = new Response(
      JSON.stringify({
        orderId: "123"
      }),
      {
        status: 200
      }
    );
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should call onError when the response is not conform: test b", async () => {
    const response = new Response(
      JSON.stringify({
        orderId: "123",
        cardFormFields: []
      }),
      {
        status: 200
      }
    );
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should call onError when the response is not conform: test c", async () => {
    const response = new Response(
      JSON.stringify({
        orderId: "123",
        cardFormFields: [
          {
            type: "TEXT",
            class: "CARD_FIELD",
            id: "CARDHOLDER_NAME",
            src: "https://stg-ta.nexigroup.com/phoenix-0.0/v3/?id=CARDHOLDER_NAME&lang=ITA&correlationid=2ebf3248-2967-4c26-aeb6-4ed8e044ae84&sessionid=iMPAbSadjGtfiSLLiQ77qg%3D%3D&placeholder=Y"
          }
        ]
      }),
      {
        status: 200
      }
    );
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should call onError when the response is not conform: test d", async () => {
    const response = new Response(
      JSON.stringify({
        orderId: "123",
        cardFormFields: [{}, {}, {}, {}]
      }),
      {
        status: 200
      }
    );
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.sessionsFields({
      sessionToken,
      walletId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });
});

describe("validate card data fields", () => {
  it("should call onError callback when the fetch rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.validations({
      sessionToken,
      walletId,
      orderId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should call onError on 500 status code", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.validations({
      sessionToken,
      walletId,
      orderId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should change the location and include outcome=1 on 4xx type response", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.validations({
      sessionToken,
      walletId,
      orderId,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(global.location.href).toContain("outcome=1");
  });

  it("should call onSuccess callback function passing the response data on 200 status code", async () => {
    const response = new Response(walletValidationsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await npg.validations({
      sessionToken,
      walletId,
      orderId,
      onSuccess,
      onError
    });
    expect(onSuccess).toHaveBeenCalledWith(walletValidationsResponse);
    expect(onError).not.toBeCalled();
  });
});
