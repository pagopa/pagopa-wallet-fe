const HELPDESK_URL: string = "https://www.pagopa.gov.it/it/helpdesk/";

export enum PaymentFaultCategory {
  ERRORE_EC = "ERRORE_EC",
  ERRORE_TECNICO = "ERRORE_TECNICO",
  ERRORE_DATI = "ERRORE_DATI",
  CUSTOM = "CUSTOM",
  NOTLISTED = "NOTLISTED",
}

type PaymentFaultErrorMessage = {
  title?: string;
  body?: string;
  category: PaymentFaultCategory;
  buttons?: Array<ErrorModalBtn>;
};

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

export const PaymentCategoryResponses: Record<
  PaymentFaultCategory,
  ErrorModal
> = {
  ERRORE_EC: {
    title: "ERRORE_EC.title",
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
  ERRORE_DATI: {
    title: "ERRORE_DATI.title",
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
  NOTLISTED: {
    title: "NOTLISTED.title",
    detail: false,
    body: "NOTLISTED.body",
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

export const PaymentResponses: Record<string, PaymentFaultErrorMessage> = {
  PPT_SINTASSI_EXTRAXSD: {
    category: PaymentFaultCategory.ERRORE_DATI,
  },
  PPT_SINTASSI_XSD: {
    category: PaymentFaultCategory.ERRORE_DATI,
  },
  PPT_PSP_SCONOSCIUTO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_PSP_DISABILITATO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_INTERMEDIARIO_PSP_SCONOSCIUTO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_INTERMEDIARIO_PSP_DISABILITATO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_CANALE_SCONOSCIUTO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_CANALE_DISABILITATO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_AUTENTICAZIONE: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_AUTORIZZAZIONE: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_DOMINIO_SCONOSCIUTO: {
    category: PaymentFaultCategory.ERRORE_DATI,
  },
  PPT_DOMINIO_DISABILITATO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_INTERMEDIARIO_PA_DISABILITATO: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_STAZIONE_INT_PA_SCONOSCIUTA: {
    category: PaymentFaultCategory.ERRORE_DATI,
  },
  PPT_STAZIONE_INT_PA_DISABILITATA: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_CODIFICA_PSP_SCONOSCIUTA: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_SEMANTICA: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PPT_STAZIONE_INT_PA_IRRAGGIUNGIBILE: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PPT_STAZIONE_INT_PA_SERVIZIO_NON_ATTIVO: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PPT_STAZIONE_INT_PA_TIMEOUT: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PPT_STAZIONE_INT_PA_ERRORE_RESPONSE: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PPT_IBAN_NON_CENSITO: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PPT_SYSTEM_ERROR: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PAA_SINTASSI_EXTRAXSD: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PAA_SINTASSI_XSD: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PAA_ID_DOMINIO_ERRATO: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PAA_ID_INTERMEDIARIO_ERRATO: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PAA_STAZIONE_INT_ERRATA: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PAA_PAGAMENTO_SCONOSCIUTO: {
    category: PaymentFaultCategory.ERRORE_DATI,
  },
  PAA_SEMANTICA: {
    category: PaymentFaultCategory.ERRORE_TECNICO,
  },
  PAA_ATTIVA_RPT_IMPORTO_NON_VALIDO: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PAA_SYSTEM_ERROR: {
    category: PaymentFaultCategory.ERRORE_EC,
  },
  PAA_PAGAMENTO_DUPLICATO: {
    title: "PAA_PAGAMENTO_DUPLICATO.title",
    body: "PAA_PAGAMENTO_DUPLICATO.body",
    category: PaymentFaultCategory.CUSTOM,
  },
  PAA_PAGAMENTO_IN_CORSO: {
    title: "PAA_PAGAMENTO_IN_CORSO.title",
    body: "PAA_PAGAMENTO_IN_CORSO.body",
    category: PaymentFaultCategory.CUSTOM,
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
  PPT_PAGAMENTO_DUPLICATO: {
    title: "PPT_PAGAMENTO_DUPLICATO.title",
    body: "PPT_PAGAMENTO_DUPLICATO.body",
    category: PaymentFaultCategory.CUSTOM,
  },
  PPT_PAGAMENTO_IN_CORSO: {
    title: "PPT_PAGAMENTO_IN_CORSO.title",
    body: "PPT_PAGAMENTO_IN_CORSO.body",
    category: PaymentFaultCategory.CUSTOM,
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
  PAA_PAGAMENTO_ANNULLATO: {
    title: "PAA_PAGAMENTO_ANNULLATO.title",
    body: "PAA_PAGAMENTO_ANNULLATO.body",
    category: PaymentFaultCategory.CUSTOM,
  },
  PAA_PAGAMENTO_SCADUTO: {
    title: "PAA_PAGAMENTO_SCADUTO.title",
    body: "PAA_PAGAMENTO_SCADUTO.body",
    category: PaymentFaultCategory.CUSTOM,
  },
  POLLING_SLOW: {
    title: "POLLING_SLOW.title",
    body: "POLLING_SLOW.body",
    category: PaymentFaultCategory.CUSTOM,
  },
  TIMEOUT: {
    title: "TIMEOUT.title",
    body: "TIMEOUT.body",
    category: PaymentFaultCategory.CUSTOM,
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
  STATUS_ERROR: {
    title: "STATUS_ERROR.title",
    body: "STATUS_ERROR.body",
    category: PaymentFaultCategory.CUSTOM,
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
  INVALID_CARD: {
    title: "INVALID_CARD.title",
    body: "INVALID_CARD.body",
    category: PaymentFaultCategory.CUSTOM,
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
  INVALID_QRCODE: {
    title: "INVALID_QRCODE.title",
    body: "INVALID_QRCODE.body",
    category: PaymentFaultCategory.CUSTOM,
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
  INVALID_DECODE: {
    title: "INVALID_DECODE.title",
    body: "INVALID_DECODE.body",
    category: PaymentFaultCategory.CUSTOM,
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
};
