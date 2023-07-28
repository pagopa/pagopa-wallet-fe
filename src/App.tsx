import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { theme } from "@pagopa/mui-italia";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Layout from "./components/commons/Layout";
import InputCardPage from "./routes/InputCardPage";
import PaymentMethodSelectionPage from "./routes/PaymentMethodPage";
import "./translations/i18n";

export function App() {
  const transactionsTheme = createTheme({
    ...theme,
    palette: {
      text: {
        primary: "#0E0F13",
        light: "#555C70"
      }
    }
  });
  return (
    <ThemeProvider theme={transactionsTheme}>
      <CssBaseline />
      <Layout>
        <Router>
          <Routes>
            <Route
              path="onboard/scegli-metodo"
              element={<PaymentMethodSelectionPage />}
            />
            <Route path="onboard/inserisci-carta" element={<InputCardPage />} />
            <Route
              path="*"
              element={<Navigate replace to="onboard/scegli-metodo" />}
            />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}
