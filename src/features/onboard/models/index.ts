import { RestBPayResponse } from "../../../../generated/definitions/payment-manager-v1/RestBPayResponse";

export interface InputCardFormFields {
  name: string;
  number: string;
  expirationDate: string;
  cvv: string;
}

export interface PaymentFormFields {
  billCode: string;
  cf: string;
}

export interface PaymentFormErrors {
  billCode?: string;
  cf?: string;
}

export interface PaymentEmailFormFields {
  email: string;
  confirmEmail: string;
}

export interface PaymentEmailFormErrors {
  email?: string;
  confirmEmail?: string;
}

export interface InputCardFormFields {
  name: string;
  number: string;
  expirationDate: string;
  cvv: string;
}

export interface InputCardFormErrors {
  name?: string;
  number?: string;
  expirationDate?: string;
  cvv?: string;
}

export enum SecureCodeDigits {
  cvv = 3,
  cid = 4
}

export const SecureCodeLabels: {
  [key: number]: { label: string; error: string };
} = {
  3: {
    label: "inputCardPage.formFields.cvv",
    error: "inputCardPage.formErrors.cvv"
  },
  4: {
    label: "inputCardPage.formFields.cid",
    error: "inputCardPage.formErrors.cid"
  }
};

export type IBpayAccountItems = NonNullable<Readonly<RestBPayResponse["data"]>>;
