import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CheckoutLoader() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      {...(isMobileDevice
        ? {
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            zIndex: 9000,
            position: "fixed",
            width: "100vw",
            height: "calc(100vh - 80px)",
            bgcolor: "#fff",
            left: 0,
            top: "80px",
            pt: "15vh",
          }
        : {
            position: "fixed",
            left: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            pt: "15vh",
            zIndex: 1000,
            width: "100vw",
            height: "80vh",
            bgcolor: "#fff",
            top: "100px",
          })}
      aria-live="assertive"
      aria-label={t("ariaLabels.loading")}
    >
      <CircularProgress />
    </Box>
  );
}
