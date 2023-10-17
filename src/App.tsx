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
import IFrameCardPage from "./routes/IframeCardPage";
import { CheckoutRoutes } from "./routes/models/routeModel";
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
            <Route
              path={CheckoutRoutes.INSERISCI_CARTA}
              element={<InputCardPage />}
            />
            <Route
              path={CheckoutRoutes.NPG_INSERISCI_CARTA}
              element={<IFrameCardPage />}
            />
            <Route
              path="*"
              element={<Navigate replace to={CheckoutRoutes.INSERISCI_CARTA} />}
            />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}
