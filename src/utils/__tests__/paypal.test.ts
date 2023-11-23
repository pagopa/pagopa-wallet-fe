/* eslint-disable functional/immutable-data */
import { pspsResponse, pspsResponseBody, sessionToken } from "../testUtils";
import "whatwg-fetch";
import "jest-location-mock";
import pm from "../api/pm";

describe("get psp for paypal onboarding", () => {
  it("should call onError callback when the fetch rejects", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await pm.paypal.getPaypalPsps({
      bearer: sessionToken,
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
    await pm.paypal.getPaypalPsps({
      bearer: sessionToken,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should change the location and include outcome=1 on 401 type response", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 401
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await pm.paypal.getPaypalPsps({
      bearer: sessionToken,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(global.location.href).toContain("outcome=14");
  });

  it("should change the location and include outcome=1 on 4xx type response", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await pm.paypal.getPaypalPsps({
      bearer: sessionToken,
      onSuccess,
      onError
    });
    expect(onSuccess).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(global.location.href).toContain("outcome=1");
  });

  it("should call onSuccess callback function passing the response data on 200 status code", async () => {
    const response = new Response(pspsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const onError = jest.fn();
    const onSuccess = jest.fn();
    await pm.paypal.getPaypalPsps({
      bearer: sessionToken,
      onSuccess,
      onError
    });
    expect(onSuccess).toHaveBeenCalledWith(pspsResponse);
  });
});
