import { Container, useTheme } from "@mui/material";
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
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        bgcolor: theme.palette.background.paper
      }}
    >
      <Container
        sx={{
          ...sx,
          py: 0,
          px: { xs: 3, sm: 6, md: 0 },
          flexGrow: 1
        }}
        maxWidth={"sm"}
      >
        {children}
      </Container>
    </Box>
  );
}
