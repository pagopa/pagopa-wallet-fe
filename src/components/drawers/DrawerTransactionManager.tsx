import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { CustomDrawer } from "../modals/CustomDrawer";

interface Props {
  drawstate: boolean;
  toggleDrawer: () => void;
}

export default function DrawerDetail(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <CustomDrawer open={props.drawstate} onClose={props.toggleDrawer}>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            textAlign: "left",
            pt: 1
          }}
        >
          <Typography variant="h4" component={"div"} my={1}>
            {t("paypalPage.managerModal.title")}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          component={"div"}
          textAlign="left"
          whiteSpace="normal"
          my={2}
        >
          {t("paypalPage.managerModal.body")}
        </Typography>
      </CustomDrawer>
    </>
  );
}
