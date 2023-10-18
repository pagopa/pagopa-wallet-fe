/**
 * This module exports an instance of fetch augmented with
 * timeout and retries with exponential backoff.
 */
import {
  AbortableFetch,
  retriableFetch,
  setFetchTimeout,
  toFetch
} from "@pagopa/ts-commons/lib/fetch";
import {
  RetriableTask,
  TransientError,
  withRetries
} from "@pagopa/ts-commons/lib/tasks";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { getConfigOrThrow } from "../../config";

//
// Returns a fetch wrapped with timeout and retry logic
//
const API_TIMEOUT = getConfigOrThrow().WALLET_CONFIG_API_TIMEOUT as Millisecond;

//
// Given predicate that return a boolean promise, fetch with transient error handling.
// Handle error that occurs once or at unpredictable intervals.
//
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

// This is a fetch with timeouts, constant backoff and with the logic
// that handles 404s as transient errors, this "fetch" must be passed to
// createFetchRequestForApi when creating "getPaymentId"

export const constantPollingWithPromisePredicateFetch = (
  shouldAbort: Promise<boolean>,
  retries: number,
  delay: number,
  timeout: Millisecond = API_TIMEOUT,
  condition: (r: Response) => Promise<boolean>
) => {
  // fetch client that can be aborted for timeout
  const abortableFetch = AbortableFetch((global as any).fetch);
  const timeoutFetch = toFetch(setFetchTimeout(timeout, abortableFetch));

  // use a constant backoff
  const constantBackoff = () => delay as Millisecond;
  const retryLogic = withRetries<Error, Response>(retries, constantBackoff);

  // use to define transient errors
  const retryWithPromisePredicate = retryLogicOnPromisePredicate(
    condition,
    retryLogic
  );

  return retriableFetch(
    retryWithPromisePredicate,
    shouldAbort
  )(timeoutFetch as (res: RequestInfo | URL) => Promise<Response>);
};
