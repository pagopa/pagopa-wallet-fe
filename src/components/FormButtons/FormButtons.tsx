import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import { default as React } from "react";
import { useTranslation } from "react-i18next";

type SubmitButton = {
  handleSubmit?: (e: React.FormEvent) => void;
  idSubmit?: string;
  type?: "submit" | "button";
  disabledSubmit: boolean;
  loadingSubmit?: boolean;
  submitTitle: string;
  disabledCancel: true;
};

type CancellableButtons = {
  handleSubmit?: (e: React.FormEvent) => void;
  handleCancel: () => void;
  type?: "submit" | "button";
  idSubmit?: string;
  idCancel?: string;
  disabledSubmit: boolean;
  disabledCancel?: false;
  loadingSubmit?: boolean;
  loadingCancel?: boolean;
  submitTitle: string;
  cancelTitle: string;
};

export function FormButtons(props: SubmitButton | CancellableButtons) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid
        justifyContent="center"
        flexDirection="row-reverse"
        alignItems="center"
        container
        spacing={2}
        my={{ xs: 2, sm: 6 }}
        position={{ xs: "relative" }}
        bottom={0}
        left={0}
        px={{ xs: 0 }}
      >
        <Grid xs={props.disabledCancel ? 12 : 8} item>
          <LoadingButton
            id={props.idSubmit}
            type={props.type}
            onSubmit={props.handleSubmit}
            loading={props.loadingSubmit || false}
            variant="contained"
            onClick={props.type === "button" ? props.handleSubmit : undefined}
            disabled={props.disabledSubmit}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 45
            }}
            aria-live="polite"
            aria-label={
              props.loadingSubmit
                ? t("ariaLabels.loading")
                : t(props.submitTitle)
            }
            aria-hidden={props.loadingSubmit}
          >
            {props.loadingSubmit ? "" : t(props.submitTitle)}
          </LoadingButton>
        </Grid>
        {!props?.disabledCancel && (
          <Grid xs={4} item>
            <LoadingButton
              variant="outlined"
              id={props.idCancel}
              onClick={props.handleCancel}
              loading={props.loadingCancel || false}
              disabled={props.disabledCancel || props.loadingSubmit || false}
              style={{
                width: "100%",
                height: "100%",
                minHeight: 45
              }}
              aria-live="polite"
              aria-label={
                props.loadingCancel
                  ? t("ariaLabels.loading")
                  : t(props.cancelTitle)
              }
              aria-hidden={props.loadingCancel}
            >
              {props.loadingCancel ? "" : t(props.cancelTitle)}
            </LoadingButton>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
}
