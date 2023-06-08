import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import { TransactionMethods } from "../../../routes/models/paymentMethodRoutes";

export interface PaymentFormFields {
  billCode: string;
  cf: string;
}

export interface PaymentEmailFormFields {
  email: string;
  confirmEmail: string;
}

export interface PaymentInfo {
  amount: number;
  paymentContextCode: string;
  rptId?: string;
  paFiscalCode?: string;
  paName?: string;
  description?: string;
  dueDate?: string;
}

export interface PaymentId {
  paymentId: string;
}

export interface PaymentMethod {
  paymentTypeCode: string;
  paymentMethodId: string;
}

export interface PaymentInstruments {
  id: string;
  name: string;
  description: string;
  status: string;
  paymentTypeCode: TransactionMethods;
  asset: string | ((sx: SxProps<Theme>) => JSX.Element);
  label: string;
  ranges: Array<{
    min: number;
    max: number;
  }>;
}

export interface PaymentNotice {
  noticeNumber: any;
  fiscalCode: any;
  amount: number;
  companyName?: string;
  description?: string;
}

interface ReturnUrls {
  returnOkUrl: string;
  returnCancelUrl: string;
  returnErrorUrl: string;
}

export interface Cart {
  paymentNotices: Array<PaymentNotice>;
  returnUrls: ReturnUrls;
  emailNotice?: string;
  idCart?: string;
}
