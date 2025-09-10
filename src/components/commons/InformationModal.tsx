/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/ban-types */
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

type InformationModalProps = {
  open?: boolean;
  onClose?: () => void;
  id?: string;
  hideIcon?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  maxWidth?: "xs" | "sm" | "lg";
  titleId?: string;
  title?: string;
  ctaId?: string;
  bodyId?: string;
};

export type InformationModalRef = {
  openDialog: () => void;
  closeDialog: () => void;
};

const InformationModal = forwardRef<InformationModalRef, InformationModalProps>(
  (props, ref) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // internal state only if consumer doesn’t control it
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = props.open !== undefined;
    const open = isControlled ? props.open : internalOpen;
    const handleClose = isControlled
      ? props.onClose
      : () => setInternalOpen(false);

    useImperativeHandle(ref, () => ({
      openDialog: () => setInternalOpen(true),
      closeDialog: () => setInternalOpen(false)
    }));

    return (
      <Dialog
        maxWidth={props.maxWidth}
        PaperProps={{
          style: { ...props.style },
          sx: {
            width: "auto",
            borderRadius: 1,
            bgcolor: theme.palette.background.default
          }
        }}
        fullWidth
        open={!!open}
        onClose={handleClose}
      >
        <DialogTitle sx={{ m: 0, p: 4 }}>
          {props.title && (
            <Typography
              id={props.titleId}
              variant="h6"
              component="div"
              sx={{ mb: 2 }}
            >
              {props.title}
            </Typography>
          )}
          {!props.hideIcon && (
            <IconButton
              aria-label={t("ariaLabels.close")}
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "action.active"
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>{props.children}</DialogContent>
      </Dialog>
    );
  }
);

InformationModal.defaultProps = {
  maxWidth: "lg"
};

export default InformationModal;
