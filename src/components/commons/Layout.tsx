import { useTheme } from "@mui/material";
import { Box, SxProps } from "@mui/system";
import React from "react";

interface LayoutProps {
  sx?: SxProps;
  children?: React.ReactNode;
}

export default function Layout({ sx, children }: LayoutProps) {
  const theme = useTheme();
  return (
    <Box
      sx={sx}
      bgcolor={theme.palette.background.paper}
      display="flex"
      flexGrow={1}
      height="100vh"
      justifyContent="center"
      px={{ xs: 3, sm: 6, md: 0 }}
    >
      {children}
    </Box>
  );
}
