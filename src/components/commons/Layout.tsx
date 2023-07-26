import { Container, useTheme } from "@mui/material";
import { Box, SxProps } from "@mui/system";
import React from "react";
import Header from "./Header";

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
        bgcolor: theme.palette.background.default,
      }}
    >
      <Header />
      <Container
        sx={{
          ...sx,
          p: { xs: 0 },
          pl: { xs: 2, sm: 6, md: 0 },
          pr: { xs: 2, sm: 6, md: 0 },
          flexGrow: 1,
        }}
        maxWidth={"sm"}
      >
        {children}
      </Container>
    </Box>
  );
}
