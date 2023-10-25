import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { toError } from "fp-ts/lib/Either";
import { ErrorsType } from "../errors/errorsModel";

export const foldResponse = (
  onError: (e: string) => void,
  onResponse: (response) => void
) =>
  TE.fold(
    (err) => {
      onError(ErrorsType.GENERIC_ERROR);
      return TE.left(err);
    },
    (myResExt) => async () =>
      pipe(
        myResExt,
        E.fold(() => ({}), onResponse)
      )
  );
