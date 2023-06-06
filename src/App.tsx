import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@pagopa/mui-italia";
import React from "react";
import { BrowserRouter } from "react-router-dom";

export function App() {
  const transactionsTheme = createTheme({ ...theme });
  return (
    <ThemeProvider theme={transactionsTheme}>
      <CssBaseline />
      <BrowserRouter></BrowserRouter>
    </ThemeProvider>
  );
}
