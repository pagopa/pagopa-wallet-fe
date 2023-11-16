import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export default function WalletLoader() {
  const { t } = useTranslation();

  return (
    <Box
      {...{
        position: "fixed",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        pt: "15vh",
        zIndex: 1000,
        width: "100vw",
        height: "100vh",
        bgcolor: "#fff"
      }}
      aria-live="assertive"
      aria-label={t("ariaLabels.loading")}
    >
      <CircularProgress />
    </Box>
  );
}
