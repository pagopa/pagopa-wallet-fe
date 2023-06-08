/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { SxProps } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";

function ClickableFieldContainer(props: {
  title?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  sx?: SxProps;
  itemSx?: SxProps;
  variant?: "body2" | "sidenav";
  disabled?: boolean;
  loading?: boolean;
  dataTestId?: string;
  dataTestLabel?: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const defaultStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: !props.loading && props.clickable ? "pointer" : "auto",
    borderBottom: "1px solid",
    borderBottomColor: "divider",
    pt: 3,
    pb: 3,
    ...props.sx,
  };

  return (
    <Box
      data-qaid={props.dataTestId}
      data-qalabel={props.dataTestLabel}
      sx={defaultStyle}
      onClick={() => {
        if (!props.disabled) {
          props.onClick && props.onClick();
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
          !!props.onClick && props.onClick();
        }
      }}
      {...(props.clickable ? { tabIndex: 0 } : {})}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          pl: 2,
          pr: 2,
          ...props.itemSx,
        }}
      >
        {props.loading ? (
          <>
            <Skeleton variant="circular" width="30px" height="30px" />
            <Skeleton variant="text" width="225px" height="30px" />
          </>
        ) : (
          <>
            {props.icon}
            <Typography
              variant={props.variant}
              component="div"
              sx={props.disabled ? { color: theme.palette.text.disabled } : {}}
            >
              {t(props.title || "")}
            </Typography>
          </>
        )}
      </Box>
      {!props.loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pr: 2,
            ...(props.disabled ? { color: theme.palette.text.disabled } : {}),
          }}
        >
          {props.endAdornment}
        </Box>
      )}
    </Box>
  );
}

ClickableFieldContainer.defaultProps = {
  flexDirection: "column",
  clickable: true,
  variant: "sidenav",
  loading: false,
};

export default ClickableFieldContainer;
