import CloseIcon from "@mui/icons-material/Close";
import { Box, Container, Drawer, IconButton, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSmallDevice } from "../../hooks/useSmallDevice";
import SkeletonFieldContainer from "../Skeletons/SkeletonFieldContainer";

export function CustomDrawer(props: {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Drawer
      anchor={useSmallDevice() ? "bottom" : "right"}
      open={props.open}
      onClose={props.onClose}
      sx={{ p: 3 }}
      PaperProps={{
        sx: { background: theme.palette.background.default },
      }}
    >
      <Container sx={{ p: 3 }} maxWidth="xs">
        <Box display="flex" justifyContent="end" alignItems="center">
          <IconButton
            aria-label={t("ariaLabels.close")}
            onClick={() => props.onClose()}
            sx={{
              color: "action.active",
              p: 0,
            }}
            aria-hidden="true"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {props.loading ? (
          <SkeletonFieldContainer
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              pl: 3,
              pr: 1,
            }}
          />
        ) : (
          props.children
        )}
      </Container>
    </Drawer>
  );
}
