import {
  AbortableFetch,
  setFetchTimeout,
  toFetch,
  retriableFetch
} from "@pagopa/ts-commons/lib/fetch";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import {
  withRetries,
  RetriableTask,
  TransientError
} from "@pagopa/ts-commons/lib/tasks";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { getConfigOrThrow } from "../../config";
import "whatwg-fetch";

const API_TIMEOUT = getConfigOrThrow().WALLET_CONFIG_API_TIMEOUT as Millisecond;

/**
 * Given predicate that return a boolean promise, fetch with transient error handling.
 * Handle error that occurs once or at unpredictable intervals.
 */
function retryLogicOnPromisePredicate(
  p: (r: Response) => Promise<boolean>,
  retryLogic: (
    t: RetriableTask<Error, Response>,
    shouldAbort?: Promise<boolean>
  ) => TE.TaskEither<Error | "max-retries" | "retry-aborted", Response>
): typeof retryLogic {
  return (t: RetriableTask<Error, Response>, shouldAbort?: Promise<boolean>) =>
    retryLogic(
      pipe(
        t,
        TE.chain((r: Response) =>
          pipe(
            TE.tryCatch(
              () => p(r),
              () => TransientError
            ),
            TE.chain<Error | TransientError, boolean, Response>((d) =>
              TE.fromEither(d ? E.left(TransientError) : E.right(r))
            )
          )
        )
      ),
      shouldAbort
    );
}

/**
 * returns a fetch that aborts after a specific timeout
 */
const fetchWithTimeout: typeof fetch = (input, init) =>
  toFetch(setFetchTimeout(API_TIMEOUT as Millisecond, AbortableFetch(fetch)))(
    input as RequestInfo,
    init
  );

/**
 * Returns a fetch wrapped with timeout and retry logic
 */
export function retryingFetch(
  condition: (r: Response) => Promise<boolean>,
  delay: number = 1000,
  timeout: Millisecond = API_TIMEOUT,
  maxRetries: number = 20
): typeof fetch {
  // a fetch that can be aborted and that gets cancelled after fetchTimeoutMs
  const abortableFetch = AbortableFetch(fetch);
  const timeoutFetch = toFetch(setFetchTimeout(timeout, abortableFetch));

  // use a constant backoff
  const constantBackoff = () => delay as Millisecond;
  const retryLogic = withRetries<Error, Response>(maxRetries, constantBackoff);

  // use to define transient errors
  const retryWithPromisePredicate = retryLogicOnPromisePredicate(
    condition,
    retryLogic
  );
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line prettier/prettier
  return retriableFetch(retryWithPromisePredicate)(timeoutFetch);
}

export default {
  fetchWithTimeout,
  retryingFetch
};
