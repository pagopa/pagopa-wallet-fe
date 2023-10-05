import { Theme } from "@emotion/react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddCardIcon from "@mui/icons-material/AddCard";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import { SxProps } from "@mui/material";
import * as React from "react";
import { CheckoutRoutes } from "./routeModel";

export enum TransactionMethods {
  PPAY = "PPAY",
  CP = "CP",
  CC = "CC"
}

interface PaymentMethodAttr {
  label: string;
  asset?: (sx: SxProps<Theme>) => JSX.Element;
  route: string;
}
type PaymentTypecode = Record<TransactionMethods, PaymentMethodAttr>;

export const PaymentMethodRoutes: PaymentTypecode = {
  PPAY: {
    label: "paymentMethods.ppay",
    asset: (sx?: SxProps<Theme>) => (
      <MobileFriendlyIcon color="primary" fontSize="small" sx={sx} />
    ),
    route: `/${CheckoutRoutes.INSERISCI_CARTA}`
  },
  CP: {
    label: "paymentMethods.cp",
    asset: (sx?: SxProps<Theme>) => (
      <AddCardIcon color="primary" fontSize="small" sx={sx} />
    ),
    route: `/${CheckoutRoutes.INSERISCI_CARTA}`
  },
  CC: {
    label: "paymentMethods.cc",
    asset: (sx?: SxProps<Theme>) => (
      <AccountBalanceIcon color="primary" fontSize="small" sx={sx} />
    ),
    route: `/${CheckoutRoutes.INSERISCI_CARTA}`
  }
};
