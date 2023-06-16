import { Typography, Box, Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import InformationModal from "./InformationModal";

export function CancelPayment(props: {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();

  return (
    <InformationModal
      open={props.open}
      onClose={props.onCancel}
      maxWidth="sm"
      hideIcon={true}
      style={{ width: "444px" }}
    >
      <Typography variant="h6" component={"div"} sx={{ pb: 2 }}>
        {t("paymentCheckPage.modal.cancelTitle")}
      </Typography>
      <Typography
        variant="body1"
        component={"div"}
        sx={{ whiteSpace: "pre-line" }}
      >
        {t("paymentCheckPage.modal.cancelBody")}
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="flex-end"
        sx={{ mt: 3, gap: 2 }}
      >
        <Button id="cancel" variant="text" onClick={props.onCancel}>
          {t("paymentCheckPage.modal.cancelButton")}
        </Button>
        <Button id="confirm" variant="contained" onClick={props.onSubmit}>
          {t("paymentCheckPage.modal.submitButton")}
        </Button>
      </Box>
    </InformationModal>
  );
}
