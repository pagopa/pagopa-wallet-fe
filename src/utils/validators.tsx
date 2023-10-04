import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React from "react";

function emailValidation(email: string) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    email
  );
}

function cardNameValidation(name: string) {
  return /^[a-zA-Z]+[\s']+([a-zA-Z]+[\s']*){1,}$/.test(name);
}

function digitValidation(text: string) {
  return /^\d+$/.test(text);
}

const getFormValidationIcon = (
  touched: boolean | undefined,
  error: boolean | undefined
) =>
  touched ? (
    error ? (
      <Close sx={{ mr: 1 }} color="error" />
    ) : (
      <Check sx={{ mr: 1, color: "green" }} />
    )
  ) : undefined;

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

export default {
  expirationDateChangeValidation,
  getFormErrorIcon,
  getFormValidationIcon,
  emailValidation,
  cardNameValidation,
  digitValidation
};
