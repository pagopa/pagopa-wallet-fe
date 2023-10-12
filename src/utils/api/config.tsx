import {
  AbortableFetch,
  setFetchTimeout,
  toFetch
} from "@pagopa/ts-commons/lib/fetch";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { getConfigOrThrow } from "../../config";

const API_TIMEOUT = getConfigOrThrow().WALLET_CONFIG_API_TIMEOUT as Millisecond;

const fetchWithTimeout: typeof fetch = (input, init) =>
  toFetch(setFetchTimeout(API_TIMEOUT as Millisecond, AbortableFetch(fetch)))(
    input as RequestInfo,
    init
  );

export default {
  fetchWithTimeout
};
