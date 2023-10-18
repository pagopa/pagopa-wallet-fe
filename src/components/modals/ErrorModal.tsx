/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/ban-types */
import CopyAllIcon from "@mui/icons-material/CopyAll";
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { ErrorsType } from "../../utils/errors/checkErrorsModel";
import {
  PaymentCategoryResponses,
  PaymentFaultCategory,
  PaymentResponses
} from "../../utils/errors/errorsModel";
import { ErrorButtons } from "../FormButtons/ErrorButton";

function ErrorModal(props: {
  error: string;
  open: boolean;
  onClose: () => void;
  onRetry?: () => void;
  style?: React.CSSProperties;
  titleId?: string;
  errorId?: string;
  bodyId?: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [copy, setCopy] = React.useState(t("clipboard.copy"));

  const isCustom = (error: string) =>
    PaymentResponses[error]?.category === PaymentFaultCategory.CUSTOM;
  const notListed = (error: string) => PaymentResponses[error] === undefined;
  const hasDetail = (error: string) =>
    !!PaymentCategoryResponses[PaymentResponses[error]?.category]?.detail;
  const showDetail = (text: string) => text === "ErrorCodeDescription";

  const getErrorTitle = () => {
    if (isCustom(props.error)) {
      return PaymentResponses[props.error]?.title;
    }
    if (notListed(props.error)) {
      return PaymentCategoryResponses[PaymentFaultCategory.NOTLISTED]?.title;
    }
    return PaymentCategoryResponses[PaymentResponses[props.error]?.category]
      ?.title;
  };
  const getErrorBody = () => {
    if (isCustom(props.error)) {
      return PaymentResponses[props.error]?.body;
    }
    if (notListed(props.error)) {
      return PaymentCategoryResponses[PaymentFaultCategory.NOTLISTED]?.body;
    }
    if (hasDetail(props.error)) {
      return "ErrorCodeDescription";
    }
    return PaymentCategoryResponses[PaymentResponses[props.error]?.category]
      ?.body;
  };

  const getErrorButtons = () => {
    if (isCustom(props.error)) {
      return PaymentResponses[props.error]?.buttons
        ? PaymentResponses[props.error]?.buttons
        : PaymentCategoryResponses[PaymentFaultCategory.CUSTOM]?.buttons;
    }
    if (notListed(props.error)) {
      return PaymentCategoryResponses[PaymentFaultCategory.NOTLISTED]?.buttons;
    }
    return PaymentCategoryResponses[PaymentResponses[props.error]?.category]
      ?.buttons;
  };

  const title = getErrorTitle() || "GenericError.title";
  const body = getErrorBody() || "GenericError.body";
  const buttons = getErrorButtons();
  const buttonsDetail =
    props.error === ErrorsType.STATUS_ERROR ||
    props.error === ErrorsType.TIMEOUT
      ? buttons?.map((elem, index) =>
          index === 1 ? { ...elem, action: props.onRetry } : elem
        )
      : buttons;
  const showProgressBar = props.error === ErrorsType.POLLING_SLOW;

  return (
    <Dialog
      PaperProps={{
        style: {
          ...props.style
        },
        sx: {
          width: "600px",
          borderRadius: 1,
          p: 4,
          background: theme.palette.background.default
        }
      }}
      fullWidth
      open={props.open}
      onClose={props.onClose}
      aria-live="assertive"
    >
      <DialogTitle sx={{ p: 0 }}>
        <Typography
          id={props.titleId}
          variant="h6"
          component={"div"}
          sx={{ mb: 2 }}
        >
          {t(title)}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Typography id={props.bodyId} variant="body1" component={"div"}>
          {t(body)}
        </Typography>
        {showDetail(body) && (
          <Alert
            severity="info"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              mt: 2,
              borderLeftColor: theme.palette.info.main + " !important",
              borderLeft: "4px solid"
            }}
            action={
              <Tooltip
                title={<>{copy}</>}
                onMouseOver={(e) => e.stopPropagation()}
              >
                <Button
                  variant="text"
                  onClick={() => {
                    void navigator.clipboard.writeText(props.error);
                    setCopy(t("clipboard.copied"));
                  }}
                  onMouseLeave={() => setCopy(t("clipboard.copy"))}
                >
                  <CopyAllIcon
                    sx={{
                      mr: 1
                    }}
                  />
                  {t("clipboard.copy")}
                </Button>
              </Tooltip>
            }
          >
            <AlertTitle
              id={props.errorId}
              sx={{
                mb: 0
              }}
            >
              {props.error}
            </AlertTitle>
          </Alert>
        )}
        {showProgressBar ? (
          <LinearProgress sx={{ my: 2 }} />
        ) : (
          !!buttonsDetail && (
            <ErrorButtons
              handleClose={props.onClose}
              buttonsDetail={buttonsDetail}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ErrorModal;
