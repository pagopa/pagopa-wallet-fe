import * as O from "fp-ts/Option";
import { OrderId } from "../../../generated/definitions/webview-payment-wallet/OrderId";
import { WalletId } from "../../../generated/definitions/webview-payment-wallet/WalletId";

enum SessionItems {
  walletId = "walletId",
  sessionToken = "sessionToken",
  orderId = "orderId"
}

/**
 * Returns the current value associated with the given key
 * or empty string if the given key does not exist.
 */
const getSessionItem = (item: SessionItems) => {
  const sessionItem = sessionStorage.getItem(item as string);
  if (!sessionItem) {
    return O.none;
  }
  return O.some(sessionItem);
};

/**
 * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
 * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set.
 * (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
 */
function setSessionItem(key: SessionItems, value: string | OrderId | WalletId) {
  try {
    sessionStorage.setItem(key as string, value);
    return O.some({ key, value });
  } catch {
    return O.none;
  }
}

const isStateEmpty = (item: SessionItems) => !getSessionItem(item);

const clearStorage = () => sessionStorage.clear();

export default {
  isStateEmpty,
  clearStorage,
  getSessionItem,
  setSessionItem,
  SessionItems
};
