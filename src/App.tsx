import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@pagopa/mui-italia";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/commons/Layout";
import { CheckoutRoutes } from "./routes/models/routeModel";
import PaymentChoicePage from "./routes/PaymentChoicePage";
import PaymentOutlet from "./routes/PaymentOutlet";

export function App() {
  const checkoutTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      background: {
        paper: theme.palette.background.default,
        default: theme.palette.background.paper,
      },
    },
    components: {
      ...theme.components,
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginTop: 0,
            height: 0,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          message: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },
      },
    },
  });

  const fixedFooterPages = [
    CheckoutRoutes.ROOT,
    CheckoutRoutes.LEGGI_CODICE_QR,
    CheckoutRoutes.SCEGLI_METODO,
    CheckoutRoutes.ANNULLATO,
    CheckoutRoutes.ESITO,
    CheckoutRoutes.ERRORE,
    CheckoutRoutes.DONA,
  ];

  return (
    <ThemeProvider theme={checkoutTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout fixedFooterPages={fixedFooterPages}>
          <Routes>
            <Route path="/" element={<PaymentOutlet />}>
              <Route
                path={CheckoutRoutes.ROOT}
                element={<PaymentChoicePage />}
              />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
