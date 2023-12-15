/* eslint-disable functional/immutable-data */
import * as E from "fp-ts/Either";
import "jest-location-mock";
import "whatwg-fetch";
import { ErrorsType } from "../errors/errorsModel";
import {
  npgSessionFieldsResponse,
  npgSessionFieldsResponseBody,
  orderId,
  sessionToken,
  walletId,
  walletValidationsResponse,
  walletValidationsResponseBody
} from "../testUtils";
import utils from "../";

describe("NPG: get form fields", () => {
  it("Returns a generic error when the promise reject", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error on status code 5xx", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Changes the location with outcome 1 on status code 4xx", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=1");
  });

  // This can't work for now. The api client should define 401 as a valid status code
  it.skip("Changes the location with outcome 14 on status code 401", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 401
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=14");
  });

  it("Return npgSessionFieldsResponse on status code 200", async () => {
    const response = new Response(npgSessionFieldsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.right(npgSessionFieldsResponse));
  });

  it("Returns a generic error when the response is not conform: test 1", async () => {
    const response = new Response(
      JSON.stringify({
        orderId: "123"
      }),
      {
        status: 200
      }
    );
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error when the response is not conform: test 2", async () => {
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
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error when the response is not conform: test 3", async () => {
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
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error when the response is not conform: test 4", async () => {
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
    const result = await utils.api.npg.createSessionWallet(
      sessionToken,
      walletId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });
});

describe("NPG: validate card fields", () => {
  it("Returns a generic error when the promise reject", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await utils.api.npg.validations(
      sessionToken,
      walletId,
      orderId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error on status code 5xx", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.validations(
      sessionToken,
      walletId,
      orderId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Changes the location with outcome 1 on status code 4xx", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.validations(
      sessionToken,
      walletId,
      orderId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=1");
  });

  // This can't work for now. The api client should define 401 as a valid status code
  it.skip("Changes the location with outcome 1 on status code 4xx", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 401
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.validations(
      sessionToken,
      walletId,
      orderId
    );
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=14");
  });

  it("Returns walletValidationsResponse on status code 200", async () => {
    const response = new Response(walletValidationsResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await utils.api.npg.validations(
      sessionToken,
      walletId,
      orderId
    );
    expect(result).toEqual(E.right(walletValidationsResponse));
  });
});
