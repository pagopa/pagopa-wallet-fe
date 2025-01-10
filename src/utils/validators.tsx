import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { makeMatchers } from "ts-adt/MakeADT";
import React from "react";
import { IdFields } from "../features/onboard/components/types";
import { OUTCOME_ROUTE } from "../routes/models/routeModel";
import { SessionWalletCreateResponseData1 } from "../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponseData";
import { ErrorsType } from "./errors/errorsModel";
import utils from ".";

function cardNameValidation(name: string) {
  return /^[a-zA-Z]+[\s']+([a-zA-Z]+[\s']*){1,}$/.test(name);
}

function digitValidation(text: string) {
  return /^\d+$/.test(text);
}

const getFormErrorIcon = (
  touched: boolean | undefined,
  error: boolean | undefined
) => {
  if (touched && error) {
    return <ErrorOutlineIcon sx={{ mr: 1 }} color="error" />;
  }
  return undefined;
};

function expirationDateChangeValidation(value: string) {
  if (!value) {
    return true;
  }
  if (value.length === 1 && !digitValidation(value)) {
    return false;
  }
  if (
    value.length === 2 &&
    value.charAt(0) === "0" &&
    value.charAt(1) === "/"
  ) {
    return false;
  }
  if (value.length > 3) {
    return /^(0[1-9]|1[0-2]|[1-9])\/{1}([0-9]{0,4})$/.test(value);
  }
  return (
    digitValidation(value.includes("/") ? value.replace("/", "") : value) &&
    value.length <= 3
  );
}

export type HTTPFamilyResponseStatusCode = {
  familyCode: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  actualCode: number;
};

function evaluateHTTPFamilyStatusCode(
  httpCode: number
): O.Option<HTTPFamilyResponseStatusCode> {
  const httpCodeToString = `${httpCode}`;
  const httpStatusCode = /^[1-5][0-9][0-9]$/;
  if (!httpStatusCode.test(httpCodeToString)) {
    return O.none;
  }
  return O.some({
    familyCode:
      `${httpCodeToString[0]}xx` as HTTPFamilyResponseStatusCode["familyCode"],
    actualCode: httpCode
  });
}

const [, matchP] = makeMatchers("familyCode");

const statusCodeValidator = (
  status: number
): E.Either<HTTPFamilyResponseStatusCode, HTTPFamilyResponseStatusCode> =>
  pipe(
    status,
    evaluateHTTPFamilyStatusCode,
    O.match(
      () => E.left({ familyCode: "5xx", actualCode: status }),
      (familyCode) =>
        pipe(
          familyCode,
          matchP(
            {
              "2xx": () => E.right(familyCode)
            },
            () => E.left(familyCode)
          )
        )
    )
  );

const getOutcome = (actualCode: number): OUTCOME_ROUTE => {
  if (actualCode === 401) {
    return OUTCOME_ROUTE.AUTH_ERROR;
  }
  if (actualCode === 422) {
    return OUTCOME_ROUTE.ALREADY_ONBOARDED;
  }
  return OUTCOME_ROUTE.GENERIC_ERROR;
};

const badStatusHandler = (familyCode: HTTPFamilyResponseStatusCode) =>
  pipe(
    familyCode,
    matchP(
      {
        "4xx": ({ actualCode }) => {
          utils.url.redirectWithOutcome(getOutcome(actualCode));
          return ErrorsType.GENERIC_ERROR;
        }
      },
      () => ErrorsType.GENERIC_ERROR
    )
  );

/**
 * This function can be used to valuate the conformity of the cardFormFields
 * used to build the iframe payment form. It checks every element of the list
 * to make sure we have at least 4 element and that each has at least a property id of type FieldId
 * and one src one of type string.
 * returns an Option<SessionWalletCreateResponse["cardFormFields"]>
 */
function validateSessionWalletCardFormFields(
  cardFormFields: SessionWalletCreateResponseData1["cardFormFields"]
): O.Option<SessionWalletCreateResponseData1["cardFormFields"]> {
  const inputIDs = new Set();
  inputIDs.add(IdFields.CARDHOLDER_NAME);
  inputIDs.add(IdFields.SECURITY_CODE);
  inputIDs.add(IdFields.CARD_NUMBER);
  inputIDs.add(IdFields.EXPIRATION_DATE);
  if (
    cardFormFields.length >= 4 &&
    cardFormFields.every((field) => {
      if (
        typeof field?.id === "string" &&
        inputIDs.has(field.id) &&
        typeof field?.src === "string"
      ) {
        inputIDs.delete(field.id);
        return true;
      }
      return false;
    })
  ) {
    return inputIDs.size === 0 ? O.some(cardFormFields) : O.none;
  }
  return O.none;
}

const Field = t.type({
  type: t.string,
  class: t.string,
  id: t.string,
  src: t.string
});

export const SessionWalletValidated = t.type({
  orderId: t.string,
  cardFormFields: t.readonlyArray(Field)
});

export default {
  expirationDateChangeValidation,
  getFormErrorIcon,
  cardNameValidation,
  digitValidation,
  evaluateHTTPFamilyStatusCode,
  matchHttpFamilyResponseStatusCode: matchP,
  validateSessionWalletCardFormFields,
  statusCodeValidator,
  badStatusHandler
};
