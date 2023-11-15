import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@pagopa/mui-italia";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/commons/Layout";
import GdiCheckPage from "./routes/GdiCheckPage";
import IFrameCardPage from "./routes/Carte";
import InputCardPage from "./routes/pm/Carte";
import BpayPage from "./routes/pm/BPay";
import { WalletRoutes } from "./routes/models/routeModel";
import "./translations/i18n";
import utils from "./utils";

utils.app.init();

const transactionsTheme = createTheme({
  ...theme,
  components: {
    ...theme.components,
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 0,
          height: 0
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }
    }
  }
});

export function App() {
  return (
    <ThemeProvider theme={transactionsTheme}>
      <CssBaseline />
      <Layout>
        <Router>
          <Routes>
            <Route path={WalletRoutes.PM_CARTE} element={<InputCardPage />} />
            <Route path={WalletRoutes.CARTE} element={<IFrameCardPage />} />
            <Route path={WalletRoutes.PM_BPAY} element={<BpayPage />} />
            <Route path={WalletRoutes.GDI_CHECK} element={<GdiCheckPage />} />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}
