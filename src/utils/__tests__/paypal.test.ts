/* eslint-disable functional/immutable-data */
import * as E from "fp-ts/Either";
import "jest-location-mock";
import "whatwg-fetch";
import pm from "../api/pm";
import { pspsResponse, pspsResponseBody, sessionToken } from "../testUtils";
import { ErrorsType } from "../errors/errorsModel";

describe.only("PayPal: get list of psp", () => {
  it("Returns a generic error when the promise reject", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await pm.paypal.getPaypalPsps(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error on status code 5xx", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.paypal.getPaypalPsps(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Changes the location with outcome 14 on status code 401", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 401
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.paypal.getPaypalPsps(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=14");
  });

  it("Changes the location with outcome 1 on status code 4xx", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.paypal.getPaypalPsps(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=1");
  });

  it("Returns a generic error when PspList is empty", async () => {
    const response = new Response(JSON.stringify({ data: [] }), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.paypal.getPaypalPsps(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error on missing data", async () => {
    const response = new Response(JSON.stringify(null), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.paypal.getPaypalPsps(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns the pspsResponse on 2xx status code", async () => {
    const response = new Response(pspsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.paypal.getPaypalPsps(sessionToken);
    expect(result).toEqual(E.right(pspsResponse));
  });
});
