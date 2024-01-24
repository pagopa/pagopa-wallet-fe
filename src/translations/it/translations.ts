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
    saveMethod: "Salva nel Portafoglio",
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
  bPayPage: {
    title: "Vuoi aggiungere questo account?",
    description: "Account BANCOMAT PAY {{nAccount}} di {{of}}",
    formButtons: {
      submit: "Aggiungi",
      annulla: "Salta"
    }
  },
  paypalPage: {
    title: "Con quale gestore vuoi usare il tuo conto PayPal",
    description:
      "Quando usi pagoPA, sei tu a decidere quale gestore della transazione ti conviene di più.\nPotrai modificare tale scelta ad ogni pagamento in base alla commissione proposta.\n",
    helpLink: "Cos'è il gestore della transazione?",
    formFields: {
      billCode: "Codice Avviso",
      cf: "Codice Fiscale Ente Creditore"
    },
    formErrors: {
      required: "Campo obbligatorio",
      minCode: "Inserisci 18 cifre",
      minCf: "Inserisci 11 cifre"
    },
    psp: {
      header: {
        name: "Gestore",
        info: "Info e costi"
      }
    },
    buttons: {
      cancel: "Annulla",
      submit: "Continua"
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
  },
  clipboard: {
    copy: "Copia",
    copied: "Copiato",
    edit: "Modifica"
  }
};
