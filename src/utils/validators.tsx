import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import * as O from "fp-ts/Option";
import { makeMatchers } from "ts-adt/MakeADT";
import React from "react";
import { SessionWalletCreateResponse } from "../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { IdFields } from "../features/onboard/components/types";

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

type HTTPFamilyResponseStatusCode = {
  familyCode: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  actualCode: number;
};

function evaluateHTTPfamilyStatusCode(
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

/**
 * This function can be used to valuate the conformity of the cardFormFields
 * used to build the iframe payment form. It cheks every element of the list
 * to make sure we have at least 4 element and that each has at least a property id of type FieldId
 * and one src one of type string.
 * returns an Option<SessionWalletCreateResponse["cardFormFields"]>
 */
function validateSessionWalletCardFormFields(
  cardFormFields: SessionWalletCreateResponse["cardFormFields"]
): O.Option<SessionWalletCreateResponse["cardFormFields"]> {
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

export default {
  expirationDateChangeValidation,
  getFormErrorIcon,
  cardNameValidation,
  digitValidation,
  evaluateHTTPfamilyStatusCode,
  matchHttpFamilyResponseStatusCode: matchP,
  validateSessionWalletCardFormFields
};
