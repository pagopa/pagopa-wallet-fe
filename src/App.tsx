import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { theme } from "@pagopa/mui-italia";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/commons/Layout";
import InputCardPage from "./routes/InputCardPage";

export function App() {
  const transactionsTheme = createTheme({ ...theme });
  return (
    <ThemeProvider theme={transactionsTheme}>
      <CssBaseline />
      <Layout>
        <Router>
          <Routes>
            <Route path="onboard/inserisci-carta" element={<InputCardPage />} />
            <Route
              path="*"
              element={<Navigate replace to="onboard/inserisci-carta" />}
            />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}
