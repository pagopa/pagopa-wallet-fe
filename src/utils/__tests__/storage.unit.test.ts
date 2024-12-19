import * as O from "fp-ts/Option";
import storage from "../storage";
const {
  setSessionItem,
  getSessionItem,
  clearStorage,
  isStateEmpty,
  SessionItems
} = storage;

beforeEach(() => clearStorage());

describe("Storage utilties:", () => {
  it("setSessionItem works correctly", () => {
    expect(isStateEmpty(SessionItems.orderId)).toBeTruthy();
    const result = setSessionItem(SessionItems.orderId, "1234");
    expect(result).toEqual(
      O.some({ key: SessionItems.orderId, value: "1234" })
    );
    expect(sessionStorage.getItem(SessionItems.orderId)).toEqual("1234");
    expect(isStateEmpty(SessionItems.orderId)).toBeFalsy();
  });

  it("getSessionItem works correctly", () => {
    setSessionItem(SessionItems.orderId, "1234");
    const orderId = getSessionItem(SessionItems.orderId);
    expect(orderId).toEqual(
      O.some({ key: SessionItems.orderId, value: "1234" })
    );
    const wallet = getSessionItem(SessionItems.walletId);
    expect(wallet).toEqual(O.none);
  });

  it("clearStorage works correctly", () => {
    expect(isStateEmpty(SessionItems.orderId)).toBeTruthy();
  });
});
