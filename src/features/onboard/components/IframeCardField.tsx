import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  useTheme,
  Skeleton
} from "@mui/material";
import { SxProps } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { Field } from "../../../../generated/definitions/webview-payment-wallet/Field";
import { FieldId, IdFields } from "./types";

interface Props {
  label: string;
  fields?: ReadonlyArray<Field>;
  id?: keyof typeof IdFields;
  style?: React.CSSProperties;
  errorCode?: string | null;
  errorMessage?: string | null;
  isValid?: boolean;
  activeField: FieldId | undefined;
  loaded: boolean;
}

interface State {
  loaded: boolean;
}

const getSrcFromFieldsByID = (
  fields: ReadonlyArray<Field>,
  id: keyof typeof IdFields
) => fields.find((field) => field.id === id)?.src;

interface Styles {
  formControl: SxProps;
  label: SxProps;
  box: SxProps;
  iframe: React.CSSProperties;
  skeleton: SxProps;
  fieldStatusIcon: React.CSSProperties;
}

export function IframeCardField(props: Props) {
  const { fields, id, errorCode, errorMessage, label, isValid, loaded } = props;
  const { t } = useTranslation();

  const styles = useStyles(props);

  // Find src based on ID
  const src = fields && id ? getSrcFromFieldsByID(fields, id) : "";

  const InnerComponent = (
    <FormControl sx={styles.formControl}>
      <InputLabel
        sx={styles.label}
        margin="dense"
        shrink
        htmlFor={id}
        id={label}
      >
        {label}
      </InputLabel>
      <Box sx={styles.box} aria-busy={!loaded}>
        <iframe
          aria-labelledby={label}
          id={`frame_${id}`}
          loading="lazy"
          seamless
          src={src}
          style={styles.iframe}
        />
        <Box
          style={styles.fieldStatusIcon}
          role="presentation"
          visibility={isValid === false ? "visible" : "hidden"}
        >
          <ErrorOutlineIcon sx={{ mr: 2.5 }} color="error" />
        </Box>
      </Box>
      {(errorMessage || errorCode) && (
        <FormHelperText
          required
          error
          id={`frame_${id}_hint`}
          aria-hidden={isValid}
          aria-live="assertive"
        >
          {t(`errorMessageNPG.${errorCode}`, {
            defaultValue: errorMessage
          })}
        </FormHelperText>
      )}
    </FormControl>
  );

  return (
    <>
      {loaded || (
        <Skeleton
          variant="text"
          sx={styles.skeleton}
          aria-busy={true}
          animation="wave"
        />
      )}
      <Box display={loaded ? "flex" : "none"}>{InnerComponent}</Box>
    </>
  );
}

const useStyles = (props: Props): Styles => {
  const { style } = props;
  const borderStyle = useBorderStyles(props);

  return {
    formControl: {
      width: "100%",
      margin: "dense",
      marginY: 3,
      borderRadius: "4px",
      boxShadow: `0 0 0 1px ${borderStyle.boxColor}`,
      transition: "box-shadow 0.1s ease-in",
      "&:hover": {
        boxShadow: `0 0 0 ${borderStyle.hoverShadowWidth} ${borderStyle.hoverShadowColor}`
      }
    },
    label: {
      background: "#fff",
      paddingX: 1,
      color: borderStyle.labelColor
    },
    box: {
      height: 61,
      width: "100%",
      padding: "1px",
      paddingLeft: 1,
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    iframe: {
      display: "flex",
      border: "none",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      ...(style || {})
    },
    skeleton: {
      display: "flex",
      width: "100%",
      maxWidth: "100%",
      cursor: "progress",
      height: "108px"
    },
    fieldStatusIcon: {
      display: "flex",
      position: "absolute",
      alignItems: "center",
      width: "10%%",
      justifySelf: "flex-end",
      cursor: "initial"
    }
  };
};

// Function to calculate border styles based on validity and active focus
const useBorderStyles = ({ isValid, activeField, id }: Props) => {
  const { palette } = useTheme();
  const errorColor = palette.error.dark;
  const focusColor = palette.primary.main;

  // Default styles for neutral state or undefined validity
  if (activeField === undefined || isValid === undefined) {
    return {
      labelColor: palette.text.secondary,
      boxColor: palette.grey[500],
      hoverShadowWidth: "1px",
      hoverShadowColor: palette.text.primary
    };
  }

  // Styles for active focus
  if (activeField === id) {
    return {
      labelColor: focusColor,
      boxColor: focusColor,
      hoverShadowWidth: "2px",
      hoverShadowColor: focusColor
    };
  }

  // Inactive focus
  return {
    labelColor: isValid ? palette.text.secondary : errorColor,
    boxColor: isValid ? palette.grey[500] : errorColor,
    hoverShadowWidth: "2px",
    hoverShadowColor: isValid ? palette.text.primary : errorColor
  };
};
