export const TRANSLATIONS_IT = {
  paymentMethodPage: {
    title: "Aggiungi un metodo",
    description:
      "Il metodo verrà memorizzato nel Portafoglio di IO e potrà essere utilizzato per effettuare pagamenti o aderire a iniziative compatibili."
  },
  inputCardPage: {
    title: "Inserisci i dati della carta",
    formFields: {
      name: "Titolare carta",
      number: "Numero carta",
      expirationDate: "Scadenza",
      cvv: "Codice di sicurezza",
      cid: "CID (4 cifre)"
    },
    formErrors: {
      required: "Campo obbligatorio",
      name: "Inserisci come riportato sulla carta",
      number: "Inserisci un numero valido",
      expirationDate: "Inserisci mm/aa",
      cvv: "Inserisci 3 cifre",
      cid: "Inserisci 4 cifre"
    },
    formButtons: {
      submit: "Continua"
    },
    privacyDesc: "Ho letto e compreso ",
    privacyTerms:
      "l'informativa privacy e accetto i termini e condizioni d'uso",
    helpLink: "Dove trovo il codice di sicurezza?",
    modal: {
      title: "Codice di sicurezza",
      description:
        "È un codice a tre cifre, chiamato CVV o CVS, che puoi trovare sul retro della tua carta.",
      descriptionAE:
        "Sulle carte American Express il codice (CID) è a quattro cifre ed è posizionato sul fronte."
    }
  },
  errorButton: {
    help: "Contatta l'assistenza",
    close: "Chiudi",
    retry: "Riprova"
  },
  GENERIC_ERROR: {
    title: "Spiacenti, si è verificato un errore imprevisto",
    body: "Prova di nuovo o contattaci per ricevere assistenza."
  },
  NOT_LISTED: {
    title: "Spiacenti, si è verificato un errore imprevisto",
    body: "Prova di nuovo o contattaci per ricevere assistenza."
  },
  ERRORE_TECNICO: {
    title: "Spiacenti, si è verificato un errore tecnico"
  }
};
