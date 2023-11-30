/* eslint-disable functional/immutable-data */
import * as E from "fp-ts/Either";
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
import "jest-location-mock";

describe("Credit Card: add to the wallet", () => {
  it("Returns a generic error when the promise reject", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await pm.creditCard.addWallet(sessionToken, walletRequest);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error on status code 5xx", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.creditCard.addWallet(sessionToken, walletRequest);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Changes the location with outcome 1 on status code 4xx", async () => {
    const response = new Response(null, { status: 404 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.creditCard.addWallet(sessionToken, walletRequest);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=1");
  });

  it("Changes the location with outcome 14 on status code 401", async () => {
    const response = new Response(null, { status: 401 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.creditCard.addWallet(sessionToken, walletRequest);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=14");
  });

  it("Returns a generic error when the idWallet is missing", async () => {
    const response = new Response(
      JSON.stringify({ data: { idWallet: undefined } }),
      {
        status: 200
      }
    );
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.creditCard.addWallet(sessionToken, walletRequest);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns the idWallet on 2xx status code", async () => {
    const response = new Response(walletResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.creditCard.addWallet(sessionToken, walletRequest);
    expect(result).toEqual(E.right(idWallet));
  });
});

describe("Bancomat Pay: getting the list", () => {
  it("Returns a generic error when the promise reject", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error on status code 5xx", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Changes the location with outcome 14 on status code 401", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 401
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=14");
  });

  it("Changes the location with outcome 1 on status code 4xx", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=1");
  });

  it("should fails when http !== 200", async () => {
    const response = new Response(JSON.stringify({ data: bpayListItems }), {
      status: 201
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("should fails when http === 200 but no bpay item", async () => {
    const response = new Response(JSON.stringify({ data: [] }), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("should fails when http === 200 but no data", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("should success when http === 200 and data", async () => {
    const response = new Response(JSON.stringify({ data: bpayListItems }), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.right(bpayListItems));
  });
});

describe("Bancomat Pay: add wallet", () => {
  it("Returns a generic error when the promise reject", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await pm.bPay.addWallet(sessionToken, bpayListItems);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Returns a generic error on status code 5xx", async () => {
    const response = new Response(null, { status: 500 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.addWallet(sessionToken, bpayListItems);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Changes the location with outcome 14 on status code 401", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 401
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.addWallet(sessionToken, bpayListItems);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=14");
  });

  it("Changes the location with outcome 1 on status code 4xx", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 404
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.addWallet(sessionToken, bpayListItems);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=1");
  });

  it("should fails when http === 200 but no data", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.addWallet(sessionToken, bpayListItems);
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("should success when http === 200", async () => {
    const response = new Response(JSON.stringify(walletItems), { status: 200 });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.addWallet(sessionToken, bpayListItems);
    expect(result).toEqual(E.right(walletItems.data));
  });
});
