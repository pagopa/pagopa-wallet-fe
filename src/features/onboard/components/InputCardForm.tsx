/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */

import CreditCardIcon from "@mui/icons-material/CreditCard";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { Box, InputAdornment, SvgIcon } from "@mui/material";
import cardValidator from "card-validator";
import { Formik, FormikProps } from "formik";
import React from "react";
import sprite from "../../../assets/app.svg";
import TextFormField from "../../../components/commons/TextFormField";
import utils from "../../../utils";

import {
  InputCardFormErrors,
  InputCardFormFields,
  SecureCodeDigits,
  SecureCodeLabels
} from "../models";
import { FormButtons } from "../../../components/FormButtons/FormButtons";

export function InputCardForm(props: {
  loading: boolean;
  onCancel?: () => void;
  onSubmit: (inputCard: InputCardFormFields) => void;
  hideCancel?: boolean;
}) {
  const formRef = React.useRef<FormikProps<InputCardFormFields>>(null);
  const [disabled, setDisabled] = React.useState(true);
  const [cvvLength, setCvvLength] = React.useState(SecureCodeDigits.cvv);
  const [ccIcon, setCcIcon] = React.useState<string | undefined>(undefined);

  const validate = (values: InputCardFormFields) => {
    cardValidator.number(values.number).card?.type === "american-express"
      ? setCvvLength(SecureCodeDigits.cid)
      : setCvvLength(SecureCodeDigits.cvv);

    values.number && setCcIcon(cardValidator.number(values.number).card?.type);
    const errors: InputCardFormErrors = {
      ...(values.name
        ? {
            ...(utils.validators.cardNameValidation(values.name)
              ? {}
              : { name: "inputCardPage.formErrors.name" })
          }
        : { name: "inputCardPage.formErrors.required" }),
      ...(values.number
        ? {
            ...(cardValidator.number(values.number).isValid
              ? {}
              : { number: "inputCardPage.formErrors.number" })
          }
        : { number: "inputCardPage.formErrors.required" }),
      ...(values.expirationDate
        ? {
            ...(cardValidator.expirationDate(values.expirationDate).isValid
              ? {}
              : {
                  expirationDate: "inputCardPage.formErrors.expirationDate"
                })
          }
        : { expirationDate: "inputCardPage.formErrors.required" }),
      ...(values.cvv
        ? {
            ...(cardValidator.cvv(values.cvv, cvvLength).isValid
              ? {}
              : {
                  cvv: SecureCodeLabels[cvvLength].error
                })
          }
        : { cvv: "inputCardPage.formErrors.required" })
    };

    setDisabled(!!Object.keys(errors).length);

    return errors;
  };

  const handleDigitChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    handleChange: (e: React.ChangeEvent<any>) => void,
    maxDigits: number
  ) => {
    utils.validators.digitValidation(e.currentTarget.value) &&
      e.currentTarget.value.length <= maxDigits &&
      handleChange(e);
  };
  const handleNumberChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const handleChange = formRef.current?.handleChange;
    if (handleChange) {
      e.currentTarget.value || handleChange(e);
      e.currentTarget.value = utils.formatters.cleanSpaces(
        e.currentTarget.value
      );
      handleDigitChange(e, handleChange, 19);
    }
  };
  const handleExpireChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const handleChange = formRef.current?.handleChange;
    const values = formRef.current?.values;
    if (handleChange && values) {
      const value = e.currentTarget.value;
      if (utils.validators.expirationDateChangeValidation(value)) {
        e.currentTarget.value = utils.formatters.expireDateFormatter(
          values.expirationDate,
          value
        );
        handleChange(e);
      }
    }
  };
  const handleCvvChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const handleChange = formRef.current?.handleChange;
    if (handleChange) {
      e.currentTarget.value || handleChange(e);
      handleDigitChange(e, handleChange, cvvLength);
    }
  };

  const handleNameChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const handleChange = formRef.current?.handleChange;
    if (handleChange) {
      e.currentTarget.value &&
        (e.currentTarget.value = e.currentTarget.value.replace(/‘|’/g, "'"));
      handleChange(e);
    }
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          name: "",
          number: "",
          expirationDate: "",
          cvv: ""
        }}
        validate={validate}
        onSubmit={props.onSubmit}
      >
        {({ touched, errors, handleBlur, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Box>
              <TextFormField
                fullWidth
                variant="outlined"
                errorText={errors.number}
                error={!!(errors.number && touched.number)}
                label="inputCardPage.formFields.number"
                id="number"
                type="text"
                inputMode="numeric"
                value={values.number}
                autoComplete="cc-number"
                handleChange={handleNumberChange}
                handleBlur={handleBlur}
                sx={{ mb: 4 }}
                endAdornment={
                  <InputAdornment position="end">
                    {utils.validators.getFormErrorIcon(
                      !!values.number,
                      !!errors.number
                    )}
                  </InputAdornment>
                }
                startAdornment={
                  ccIcon ? (
                    <SvgIcon sx={{ mr: 2 }} color="action">
                      <use href={sprite + `#icons-${ccIcon}-mini`} />
                    </SvgIcon>
                  ) : (
                    <CreditCardIcon sx={{ mr: 2 }} color="action" />
                  )
                }
              />
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                sx={{ gap: 2 }}
              >
                <TextFormField
                  fullWidth
                  variant="outlined"
                  errorText={errors.expirationDate}
                  error={!!(errors.expirationDate && touched.expirationDate)}
                  label="inputCardPage.formFields.expirationDate"
                  id="expirationDate"
                  type="text"
                  inputMode="numeric"
                  value={values.expirationDate}
                  autoComplete="cc-exp"
                  handleChange={handleExpireChange}
                  handleBlur={handleBlur}
                  sx={{ mb: 4 }}
                  endAdornment={
                    <InputAdornment position="end">
                      {utils.validators.getFormErrorIcon(
                        !!values.expirationDate,
                        !!errors.expirationDate
                      )}
                    </InputAdornment>
                  }
                  startAdornment={
                    <DateRangeIcon sx={{ mr: 2 }} color="action" />
                  }
                />
                <TextFormField
                  fullWidth
                  variant="outlined"
                  errorText={errors.cvv}
                  error={!!(errors.cvv && touched.cvv)}
                  label={SecureCodeLabels[cvvLength].label}
                  id="cvv"
                  type="text"
                  inputMode="numeric"
                  value={values.cvv}
                  autoComplete="cc-csc"
                  handleChange={handleCvvChange}
                  handleBlur={handleBlur}
                  sx={{ mb: 4 }}
                  endAdornment={
                    <InputAdornment position="end">
                      {utils.validators.getFormErrorIcon(
                        !!values.cvv,
                        !!errors.cvv
                      )}
                    </InputAdornment>
                  }
                  startAdornment={<LockIcon sx={{ mr: 2 }} color="action" />}
                />
              </Box>
              <TextFormField
                fullWidth
                variant="outlined"
                errorText={errors.name}
                error={!!(errors.name && touched.name)}
                label="inputCardPage.formFields.name"
                id="name"
                type="text"
                value={values.name}
                autoComplete="cc-name"
                handleChange={handleNameChange}
                handleBlur={handleBlur}
                sx={{ mb: 2 }}
                startAdornment={<PersonIcon sx={{ mr: 2 }} color="action" />}
              />
              <FormButtons
                disabledCancel
                disabledSubmit={!!disabled}
                handleSubmit={handleSubmit as () => void}
                loadingSubmit={props.loading}
                submitTitle="inputCardPage.formButtons.submit"
                type="submit"
              />
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}
