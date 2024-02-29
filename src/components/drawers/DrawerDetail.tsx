import { Alert, Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { CustomDrawer } from "../modals/CustomDrawer";

interface Props {
  drawstate: boolean;
  toggleDrawer: () => void;
}

export default function DrawerDetail(props: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <CustomDrawer open={props.drawstate} onClose={props.toggleDrawer}>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          textAlign: "left",
          pt: 1
        }}
      >
        <Typography variant="h6" component={"div"}>
          {t("mainPage.header.detail.detailAmount")}
        </Typography>
      </Box>
      <Alert
        severity="info"
        variant="standard"
        sx={{
          my: 2,
          borderLeftColor: theme.palette.info.main + " !important",
          borderLeft: "4px solid",
          alignItems: "center"
        }}
      >
        <Typography
          variant="body2"
          component={"div"}
          textAlign="left"
          whiteSpace="normal"
        >
          {t("mainPage.header.disclaimer")}
        </Typography>
      </Alert>
    </CustomDrawer>
  );
}
