export type FormStatus = Record<FieldId, FieldStatus>;

export interface FieldStatus {
  isValid?: boolean;
  errorCode: null | string;
  errorMessage: null | string;
}

export enum IdFields {
  CARD_NUMBER = "CARD_NUMBER",
  EXPIRATION_DATE = "EXPIRATION_DATE",
  SECURITY_CODE = "SECURITY_CODE",
  CARDHOLDER_NAME = "CARDHOLDER_NAME",
}

export type FieldId = keyof typeof IdFields;
