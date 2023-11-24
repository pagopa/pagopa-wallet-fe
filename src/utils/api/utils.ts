import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe, flow } from "fp-ts/function";
import { toError } from "fp-ts/lib/Either";
import { IResponseType } from "@pagopa/ts-commons/lib/requests";
import { ErrorsType } from "../errors/errorsModel";
import { HTTPFamilyResponseStatusCode } from "../validators";
import utils from "..";

const validateApi = <E, A, T>(
  api: TE.TaskEither<E, A>,
  onRight: (a: A) => E.Either<ErrorsType, T>
) =>
  pipe(
    TE.tryCatch(api, toError),
    TE.match(
      () => E.left(ErrorsType.GENERIC_ERROR),
      flow(E.match(() => E.left(ErrorsType.GENERIC_ERROR), onRight))
    )
  )();

const matchApiStatus = <T, O>(
  response: IResponseType<number, T, string>,
  onRight: (
    statusResponse: HTTPFamilyResponseStatusCode
  ) => E.Either<ErrorsType, O>
) =>
  pipe(
    response.status,
    utils.validators.statusCodeValidator, // response type doesn't match
    E.match(
      (responseStatus) =>
        E.left(utils.validators.badStatusHandler(responseStatus)),
      onRight
    )
  );

export default {
  validateApi,
  matchApiStatus
};
