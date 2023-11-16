import { Box, Typography } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createTypography";
import React from "react";
import { useTranslation } from "react-i18next";
import { usePromiseTracker } from "react-promise-tracker";
import WalletLoader from "../../components/commons/WalletLoader";

export default function PageContainer(props: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  link?: React.ReactNode;
  childrenSx?: CSSProperties;
}) {
  const { t } = useTranslation();
  const { promiseInProgress } = usePromiseTracker({ area: "page-container" });
  return (
    <Box mb={4} aria-live="polite">
      {promiseInProgress && <WalletLoader />}
      {!!props.title && (
        <Typography variant="h4" component={"div"} mb={2} color="text.primary">
          {t(props.title)}
        </Typography>
      )}
      {!!props.description && (
        <Typography variant="body2" sx={{ mb: 1 }} color="text.light">
          {t(props.description)}
          {!!props.link && props.link}
        </Typography>
      )}
      <Box sx={props.childrenSx}>{props.children}</Box>
    </Box>
  );
}
