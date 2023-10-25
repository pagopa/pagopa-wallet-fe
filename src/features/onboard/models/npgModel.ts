import { FieldId } from "../components/types";

enum NpgEvtDataErroCode {
  HF0001 = "HF0001",
  HF0002 = "HF0002",
  HF0003 = "HF0003",
  HF0004 = "HF0004",
  HF0005 = "HF0005",
  HF0006 = "HF0006",
  HF0007 = "HF0007",
  HF0009 = "HF0009"
}
export interface NpgEvtData {
  id: FieldId;
  errorCode: NpgEvtDataErroCode;
  errorMessage: string;
}

export interface NpgFlowStateEvtData {
  data: {
    url: string;
  };
}

export enum NpgFlowState {
  REDIRECTED_TO_EXTERNAL_DOMAIN = "REDIRECTED_TO_EXTERNAL_DOMAIN",
  PAYMENT_COMPLETE = "PAYMENT_COMPLETE",
  READY_FOR_PAYMENT = "READY_FOR_PAYMENT",
  PAYMENT_METHOD_SELECTION = "PAYMENT_METHOD_SELECTION",
  CARD_DATA_COLLECTION = "CARD_DATA_COLLECTION",
  GDI_VERIFICATION = "GDI_VERIFICATION"
}
