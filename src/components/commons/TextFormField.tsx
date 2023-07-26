/* eslint-disable functional/immutable-data */
import { TextField } from "@mui/material";
import { SxProps } from "@mui/system";
import React, { FocusEventHandler, FormEventHandler } from "react";
import { useTranslation } from "react-i18next";

interface TextFormFieldProps {
  fullWidth: boolean;
  errorText: string | undefined;
  error: boolean;
  label: string;
  id: string;
  type: string;
  variant?: "outlined" | "standard" | "filled" | undefined;
  style?: React.CSSProperties;
  sx?: SxProps;
  value?: string | number;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  inputMode?:
    | "search"
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | undefined;
  autoComplete?: string;
  handleChange: FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

function TextFormField(props: TextFormFieldProps) {
  const { t } = useTranslation();

  return (
    <TextField
      fullWidth={props.fullWidth}
      margin="dense"
      disabled={props.disabled}
      helperText={props.errorText ? t(props.errorText) : ""}
      error={props.error}
      label={t(props.label)}
      id={props.id}
      name={props.id}
      variant={props.variant}
      autoComplete={props.autoComplete}
      style={props.style}
      sx={props.sx}
      InputProps={{
        name: props.id,
        type: props.type,
        onChange: props.handleChange,
        onBlur: props.handleBlur,
        endAdornment: props.endAdornment,
        startAdornment: props.startAdornment,
        value: props.value,
        readOnly: props.readOnly,
      }}
      inputProps={{
        inputMode: props.inputMode,
      }}
    />
  );
}

TextFormField.defaultProps = {
  variant: "outlined",
  style: undefined,
  sx: undefined,
  endAdornment: undefined,
  disabled: false,
  readOnly: false,
};

export default TextFormField;
