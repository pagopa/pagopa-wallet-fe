const HELPDESK_URL: string = "https://www.pagopa.gov.it/it/helpdesk/";

export enum ErrorsType {
  MISSING_SESSIONTOKEN = "MISSING_SESSIONTOKEN",
  STATUS_ERROR = "STATUS_ERROR",
  TIMEOUT = "TIMEOUT",
  POLLING_SLOW = "POLLING_SLOW",
  GENERIC_ERROR = "GENERIC_ERROR"
}

export type ErrorModalBtn = {
  title: string;
  action?: () => void;
};

type ErrorModal = {
  title: string;
  body?: string;
  detail?: boolean;
  code?: string;
  closeLabel?: string;
  buttons?: Array<ErrorModalBtn>;
};

export enum WalletFaultCategory {
  ERRORE_TECNICO = "ERRORE_TECNICO",
  CUSTOM = "CUSTOM",
  NOT_LISTED = "NOT_LISTED",
  GENERIC_ERROR = "GENERIC_ERROR"
}

export const ErrorModalByErrorCategory: Record<
  WalletFaultCategory,
  ErrorModal
> = {
  ERRORE_TECNICO: {
    title: "ERRORE_TECNICO.title",
    detail: true,
    buttons: [
      {
        title: "errorButton.help",
        action: () => {
          window.open(HELPDESK_URL, "_blank")?.focus();
        },
      },
      {
        title: "errorButton.close",
      },
    ],
  },
  CUSTOM: {
    title: "",
    detail: false,
    buttons: [
      {
        title: "errorButton.close",
      },
      {
        title: "errorButton.help",
        action: () => {
          window.open(HELPDESK_URL, "_blank")?.focus();
        },
      },
    ],
  },
  GENERIC_ERROR: {
    title: "ERRORE_GENERICO.title",
    detail: false,
    buttons: [
      {
        title: "errorButton.close",
      },
      {
        title: "errorButton.help",
        action: () => {
          window.open(HELPDESK_URL, "_blank")?.focus();
        },
      },
    ],
  },
  NOT_LISTED: {
    title: "NOT_LISTED.title",
    detail: false,
    body: "NOT_LISTED.body",
    buttons: [
      {
        title: "errorButton.close",
      },
      {
        title: "errorButton.help",
        action: () => {
          window.open(HELPDESK_URL, "_blank")?.focus();
        },
      },
    ],
  },
};

export type WalletErrorMessage = {
  title?: string;
  body?: string;
  category: WalletFaultCategory;
  buttons?: Array<ErrorModalBtn>;
};



export const WalletErrors: Record<ErrorsType, WalletErrorMessage> = {
  [ErrorsType.MISSING_SESSIONTOKEN]: {
    category: WalletFaultCategory.ERRORE_TECNICO
  },
  [ErrorsType.TIMEOUT]: {
    title: "TIMEOUT.title",
    body: "TIMEOUT.body",
    category: WalletFaultCategory.CUSTOM,
    buttons: [
      {
        title: "errorButton.help",
        action: () => {
          window.open(HELPDESK_URL, "_blank")?.focus();
        },
      },
      {
        title: "errorButton.retry",
      },
    ],
  },
  [ErrorsType.POLLING_SLOW]: {
    title: "POLLING_SLOW.title",
    body: "POLLING_SLOW.body",
    category: WalletFaultCategory.CUSTOM,
  },
  [ErrorsType.STATUS_ERROR]: {
    title: "STATUS_ERROR.title",
    body: "STATUS_ERROR.body",
    category: WalletFaultCategory.CUSTOM,
    buttons: [
      {
        title: "errorButton.help",
        action: () => {
          window.open(HELPDESK_URL, "_blank")?.focus();
        },
      },
      {
        title: "errorButton.retry",
      },
    ],
  },
  [ErrorsType.GENERIC_ERROR]: {
    category: WalletFaultCategory.NOT_LISTED
  }
};
