/* eslint-disable functional/immutable-data */
import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import { default as React } from "react";
import { useTranslation } from "react-i18next";

export default function FormButtons(props: {
  handleSubmit: () => void;
  handleCancel: () => void;
  type?: "submit" | "button";
  disabledSubmit: boolean;
  disabledCancel?: boolean;
  loadingSubmit?: boolean;
  loadingCancel?: boolean;
  idCancel?: string;
  idSubmit?: string;
  submitTitle: string;
  cancelTitle: string;
  hideCancel?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid
        sx={{
          position: { xs: "fixed", sm: "relative" },
          zIndex: { xs: 1000, sm: 0 },
          bottom: { xs: 0 },
          left: { xs: 0 },
          p: { xs: "1rem", sm: 0 },
          boxShadow: { xs: "0 0.5rem 1rem rgb(0 0 0 / 15%)", sm: "none" },
          bgcolor: { xs: "background.default" },
          my: { sm: 6 },
        }}
        justifyContent="center"
        flexDirection="row-reverse"
        alignItems="center"
        container
        spacing={2}
      >
        <Grid xs={props.hideCancel ? 12 : 8} style={{ paddingTop: 0 }} item>
          <LoadingButton
            type={props.type}
            onSubmit={props.handleSubmit}
            loading={props.loadingSubmit || false}
            variant="contained"
            id={props.idSubmit}
            onClick={props.type === "button" ? props.handleSubmit : undefined}
            disabled={props.disabledSubmit}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 45,
            }}
            aria-live="polite"
            aria-label={
              props.loadingSubmit
                ? t("ariaLabels.loading")
                : t(props.submitTitle)
            }
            aria-hidden={props.loadingCancel}
          >
            {props.loadingSubmit ? "" : t(props.submitTitle)}
          </LoadingButton>
        </Grid>
        <Grid xs={4} style={{ paddingTop: 0 }} item>
          <LoadingButton
            variant="outlined"
            onClick={props.handleCancel}
            loading={props.loadingCancel || false}
            disabled={props.disabledCancel || props.loadingSubmit || false}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 45,
              ...(props.hideCancel ? { display: "none" } : {}),
            }}
            aria-live="polite"
            aria-label={
              props.loadingCancel
                ? t("ariaLabels.loading")
                : t(props.cancelTitle)
            }
            id={props.idCancel}
            aria-hidden={props.loadingSubmit}
          >
            {props.loadingCancel ? "" : t(props.cancelTitle)}
          </LoadingButton>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

FormButtons.defaultProps = {
  type: "button",
};
