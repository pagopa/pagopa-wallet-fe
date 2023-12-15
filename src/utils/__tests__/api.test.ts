/* eslint-disable functional/immutable-data */
import * as E from "fp-ts/Either";
import pm from "../api/pm";
import npg from "../api/npg";
import { ErrorsType } from "../errors/errorsModel";
import {
  walletRequest,
  sessionToken,
  idWallet,
  walletResponseBody,
  bpayListItems,
  walletItems,
  getSessionWalletResponseBody,
  orderId,
  walletId,
  getSessionWalletResponse,
  paymentMethodId,
  getPspsForPaymentMethodBody,
  getPspsForPaymentMethodResponse
} from "../testUtils";
import "jest-location-mock";
import "whatwg-fetch";

// This is because I want test without the retry functionality
jest.mock("../api/config", () => {
  const originalModule = jest.requireActual("../api/config");
  return {
    __esModule: true,
    ...originalModule,
    default: {
      ...originalModule.default,
      retryingFetch: jest.fn(
        () => (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, init)
      )
    }
  };
});

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

describe("NPG Credit Card: getSessionWallet", () => {
  it("Return an instance of Task.right cointaing the response", async () => {
    const response = new Response(getSessionWalletResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await npg.getSessionWallet(walletId, orderId, "1234");

    expect(result).toEqual(E.right(getSessionWalletResponse));
  });

  it("Return an instance of Task.left with the error", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await npg.getSessionWallet(walletId, orderId, "1234");

    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });

  it("Redirect an 401", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 401
    });

    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await npg.getSessionWallet(walletId, orderId, "1234");
    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
    expect(global.location.href).toContain("outcome=14");
  });
});

describe("NPG apm: getPspsForPaymentMethod", () => {
  it("Return an instance of Task.right cointaing the response", async () => {
    const response = new Response(getPspsForPaymentMethodBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await npg.getPspsForPaymentMethod(paymentMethodId);

    expect(result).toEqual(E.right(getPspsForPaymentMethodResponse));
  });

  it("Return an instance of Task.left with the error", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await npg.getPspsForPaymentMethod(paymentMethodId);

    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });
});
