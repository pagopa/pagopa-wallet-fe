/* eslint-disable functional/immutable-data */
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { TransientError } from "@pagopa/ts-commons/lib/tasks";
import { retryLogicOnPromisePredicate } from "../api/config";
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
  getPspsForWalletResponse,
  getPspsForWalletResponseBody
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

  it("should return E.right with empty array when http === 200 but no bpay item", async () => {
    const response = new Response(JSON.stringify({ data: [] }), {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await pm.bPay.getList(sessionToken);
    expect(result).toEqual(E.right([]));
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
    const response = new Response(getPspsForWalletResponseBody, {
      status: 200
    });
    global.fetch = jest.fn(() => Promise.resolve(response));
    const result = await npg.getPspsForWallet(walletId, sessionToken);

    expect(result).toEqual(E.right(getPspsForWalletResponse));
  });

  it("Return an instance of Task.left with the error", async () => {
    global.fetch = jest.fn(() => Promise.reject());
    const result = await npg.getPspsForWallet(walletId, sessionToken);

    expect(result).toEqual(E.left(ErrorsType.GENERIC_ERROR));
  });
});

describe("retryLogicOnPromisePredicate", () => {
  const mockResponse = new Response("mock", { status: 200 });
  const mockTask: TE.TaskEither<Error | "transient", Response> =
    TE.right(mockResponse);
  const mockRetryLogic = (
    t: TE.TaskEither<Error | "transient", Response>
  ): TE.TaskEither<Error | "max-retries" | "retry-aborted", Response> =>
    t as unknown as TE.TaskEither<
      Error | "max-retries" | "retry-aborted",
      Response
    >;

  it("should return Left(TransientError) when the predicate returns true", async () => {
    const predicateReturnsTrue = (_: Response) => Promise.resolve(true);
    const testFunc = retryLogicOnPromisePredicate(
      predicateReturnsTrue,
      mockRetryLogic
    );
    const result = await testFunc(mockTask)();

    // eslint-disable-next-line no-underscore-dangle
    expect(result._tag).toBe("Left");
    // eslint-disable-next-line no-underscore-dangle
    if (result._tag === "Left") {
      expect(result.left).toBe(TransientError);
    }
  });

  it("should return Right(mockResponse) when the predicate returns false", async () => {
    const predicateReturnsFalse = (_: Response) => Promise.resolve(false);
    const testFunc = retryLogicOnPromisePredicate(
      predicateReturnsFalse,
      mockRetryLogic
    );
    const result = await testFunc(mockTask)();

    // eslint-disable-next-line no-underscore-dangle
    expect(result._tag).toBe("Right");
    // eslint-disable-next-line no-underscore-dangle
    if (result._tag === "Right") {
      expect(result.right).toBe(mockResponse);
    }
  });
});
