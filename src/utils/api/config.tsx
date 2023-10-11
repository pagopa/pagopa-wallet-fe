import {
  AbortableFetch,
  setFetchTimeout,
  toFetch
} from "@pagopa/ts-commons/lib/fetch";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import env from "../env";

const { API_TIMEOUT = 5000 } = env;

const fetchWithTimeout: typeof fetch = (input, init) =>
  toFetch(setFetchTimeout(API_TIMEOUT as Millisecond, AbortableFetch(fetch)))(
    input as RequestInfo,
    init
  );

export default {
  fetchWithTimeout
};
