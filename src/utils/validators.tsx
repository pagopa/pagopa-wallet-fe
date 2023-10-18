import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import * as O from "fp-ts/Option";
import { makeMatchers } from "ts-adt/MakeADT";
import React from "react";

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

export default {
  expirationDateChangeValidation,
  getFormErrorIcon,
  cardNameValidation,
  digitValidation,
  evaluateHTTPfamilyStatusCode,
  matchHttpFamilyResponseStatusCode: matchP
};
