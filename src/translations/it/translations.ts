export const TRANSLATIONS_IT = {
  mainPage: {
    footer: {
      accessibility: "Accessibilità",
      help: "Aiuto",
      pagoPA: "Visita il sito pagoPA",
    },
    header: {
      disclaimer:
        "L’importo è aggiornato in automatico, così paghi sempre quanto dovuto ed eviti more o altri interessi.",
      detail: {
        detailTitle: "Dettaglio avviso",
        detailAmount: "Importo",
        detailSubject: "Oggetto del pagamento",
        detailReceiver: "Ente Creditore",
        detailFC: "Codice Fiscale Ente Creditore",
        detailIUV: "Codice IUV",
      },
    },
  },
  privacyInfo: {
    privacyDesc: "Proseguendo dichiari di aver letto e compreso l'",
    googleDesc: " Form protetto tramite reCAPTCHA e Google",
    privacy: "Informativa Privacy e i Termini e condizioni d'uso del servizio",
    privacyPolicy: "Privacy Policy",
    serviceTerms: "Termini di servizio",
    privacyUrl: "/privacypolicy/it.html",
    and: "e i",
    privacyDonation:
      "Termini aggiuntivi del servizio Donazioni a favore dell’emergenza in Ucraina",
  },
  paymentNoticePage: {
    title: "Cosa devi pagare?",
    description: "Inserisci i dati come riportato sull’avviso di pagamento.",
    helpLink: "Vedi un esempio",
    formFields: {
      billCode: "Codice Avviso",
      cf: "Codice Fiscale Ente Creditore",
    },
    formErrors: {
      required: "Campo obbligatorio",
      minCode: "Inserisci 18 cifre",
      minCf: "Inserisci 11 cifre",
    },
    formButtons: {
      cancel: "Indietro",
      submit: "Continua",
    },
  },
  paymentSummaryPage: {
    title: "Dati del pagamento",
    description:
      "pagoPA aggiorna automaticamente l'importo per assicurarti di aver pagato esattamente quanto dovuto ed evitarsi così more o altri interessi",
    amount: "Importo aggiornato",
    creditor: "Ente Creditore",
    causal: "Oggetto del pagamento",
    billCode: "Codice Avviso",
    cf: "Codice Fiscale Ente Creditore",
    iuv: "Codice IUV",
    dialog: {
      title: "Vedi un importo diverso?",
      description:
        "pagoPA aggiorna automaticamente l'importo per assicurarti di aver pagato esattamente quanto dovuto ed evitarti così more o altri interessi.",
    },
    buttons: {
      cancel: "Indietro",
      submit: "Vai al pagamento",
      ok: "Ok, va bene",
    },
  },
  paymentEmailPage: {
    title: "Inserisci la tua email",
    description: "Riceverai l'esito del pagamento a questo indirizzo",
    formFields: {
      email: "Indirizzo email",
      confirmEmail: "Ripeti di nuovo",
    },
    formErrors: {
      required: "Campo obbligatorio",
      invalid: "Inserisci un indirizzo email valido",
      notEqual: "Gli indirizzi email devono coincidere",
    },
    formButtons: {
      submit: "Continua",
      back: "Indietro",
    },
  },
  indexPage: {
    title: "Paga un avviso",
    description:
      "Puoi usare la tua carta di debito o credito, senza fare alcun login. Riceverai l'esito del pagamento via email.",
  },
  paymentNoticeChoice: {
    qr: {
      title: "Inquadra il codice QR",
      description: "Usa la tua webcam o fotocamera",
    },
    form: {
      title: "Inserisci tu i dati",
      description: "Codice Avviso e Codice Fiscale Ente",
    },
  },
  general: {
    and: "e",
  },
  inputCardPage: {
    title: "Inserisci i dati della carta",
    formFields: {
      name: "Titolare carta",
      number: "Numero carta",
      expirationDate: "Scadenza",
      cvv: "Codice di sicurezza",
      cid: "CID (4 cifre)",
    },
    formErrors: {
      required: "Campo obbligatorio",
      name: "Inserisci come riportato sulla carta",
      number: "Inserisci un numero valido",
      expirationDate: "Inserisci mm/aa",
      cvv: "Inserisci 3 cifre",
      cid: "Inserisci 4 cifre",
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
        "Sulle carte American Express il codice (CID) è a quattro cifre ed è posizionato sul fronte.",
    },
  },
  cartDetail: {
    amount: "Importo",
    companyName: "Ente Creditore",
    description: "Oggetto del pagamento",
    fiscalCode: "Codice Fiscale Ente Creditore",
    noticeNumber: "Codice Avviso",
  },
  errorButton: {
    help: "Contatta l'assistenza",
    close: "Chiudi",
    retry: "Riprova",
  },
  POLLING_SLOW: {
    title: "Spiacenti, l’Ente sta impiegando più tempo del previsto...",
    body: "Ti preghiamo di attendere un paio di minuti al massimo senza ricaricare la pagina nel frattempo.",
  },
  ERRORE_EC: {
    title: "Spiacenti, l’Ente Creditore sta avendo problemi nella risposta",
    buttons: {
      help: "Contatta l'assistenza",
      close: "Chiudi",
    },
  },
  ERRORE_TECNICO: {
    title: "Spiacenti, c’è un problema tecnico con questo avviso",
  },
  ERRORE_DATI: {
    title: "Spiacenti, i dati dell'avviso non sono corretti",
  },
  NOTLISTED: {
    title: "Spiacenti, si è verificato un errore imprevisto",
    body: "Prova di nuovo o contattaci per ricevere assistenza.",
  },
  PAA_PAGAMENTO_DUPLICATO: {
    title: "Questo avviso è stato già pagato!",
    body: "La ricevuta è stata inviata all'indirizzo email che hai indicato durante il pagamento.",
  },
  PAA_PAGAMENTO_IN_CORSO: {
    title: "Il pagamento è già in corso, riprova tra qualche minuto",
    body: "Se è passato troppo tempo, segnalacelo!",
  },
  PPT_PAGAMENTO_DUPLICATO: {
    title: "Questo avviso è stato già pagato!",
    body: "La ricevuta è stata inviata all'indirizzo email che hai indicato durante il pagamento.",
  },
  PPT_PAGAMENTO_IN_CORSO: {
    title: "Il pagamento è già in corso, riprova tra qualche minuto",
    body: "Se è passato troppo tempo, segnalacelo!",
  },
  PAA_PAGAMENTO_ANNULLATO: {
    title: "Spiacenti, l’Ente Creditore ha revocato questo avviso",
    body: "Contatta l’Ente per maggiori informazioni.",
  },
  PAA_PAGAMENTO_SCADUTO: {
    title: "Spiacenti, l’avviso è scaduto e non è più possibile pagarlo",
    body: "Contatta l’Ente per maggiori informazioni.",
  },
  ErrorCodeDescription: "Codice di errore per l'assistenza",
  clipboard: {
    copy: "Copia",
    copied: "Copiato",
    edit: "Modifica",
  },
  GenericError: {
    title: "Spiacenti, si è verificato un errore imprevisto",
    body: "Prova di nuovo o contattaci per ricevere assistenza.",
  },
  STATUS_ERROR: {
    title: "Spiacenti, si è verificato un errore imprevisto",
    body: "Se il problema persiste, segnalacelo!",
  },
  TIMEOUT: {
    title: "Spiacenti, l'Ente Creditore sta avendo problemi nella risposta",
    body: "Se il problema persiste, segnalacelo!",
  },
  INVALID_CARD: {
    title: "Spiacenti, la carta è risultata non valida",
    body: "Prova ad inserire una carta valida o eventualmente contattaci per ricevere assistenza.",
  },
  INVALID_QRCODE: {
    title: "Il codice inquadrato non è un avviso pagoPA",
    body: "Se il problema persiste, prova a inserire i dati manualmente.",
  },
  INVALID_DECODE: {
    title: "Si è verificato un errore nella lettura dei dati",
    body: "Prova di nuovo o contattaci per ricevere assistenza.",
  },
  DONATIONLIST_ERROR:
    "Non siamo riusciti a caricare la lista delle organizzazioni.",
  paymentChoicePage: {
    title: "Come vuoi pagare?",
    description:
      "Per saperne di più sui metodi e i costi applicati dai gestori aderenti, visita la pagina ",
    costs: "Trasparenza Costi.",
    creditCard: "Carta di debito o credito",
    bank: "Conto corrente",
    others: "Altri metodi",
    incoming: "In arrivo",
    showMore: "Mostra tutti",
    button: "Indietro",
  },
  paymentQrPage: {
    title: "Inquadra il Codice QR",
    description:
      "Assicurati di avere una buona illuminazione. Se il codice non è a fuoco, prova ad allontanarlo leggermente dallo schermo.",
    navigate: "Non funziona? Inserisci manualmente",
    camBlocked:
      "Abbiamo bisogno del tuo consenso per utilizzare la fotocamera. Per modificare la tua scelta, visita le impostazioni Privacy del tuo browser",
    reloadPage: "Ricarica la pagina",
  },
  paymentCheckPage: {
    total: "Totale",
    creditCard: "Paga con",
    transaction: "Costo della transazione",
    psp: "Gestita da",
    email: "Invia esito a:",
    modal: {
      title: "Perché c'è un costo di transazione?",
      body: "Qualsiasi operazione di trasferimento di denaro (in contanti o in moneta elettronica) ha un costo, che serve a garantirti che quel pagamento sia sicuro e arrivi a buon fine.\n\nOgni gestore (o PSP, Prestatore di Servizi di Pagamento), propone un costo di transazione, a seconda delle proprie politiche commerciali e condizioni contrattuali.\n\nCon pagoPA, questi costi sono trasparenti e il cittadino può scegliere liberamente l'opzione più comoda e conveniente. Per saperne di più, consulta la pagina ",
      link: "Trasparenza Costi",
      cancelTitle: "Uscire dal pagamento in corso?",
      cancelBody: "Tutti i dati inseriti andranno persi.",
      cancelButton: "No, ho cambiato idea",
      submitButton: "Esci",
    },
    buttons: {
      cancel: "Annulla",
      submit: "Paga",
      wait: "Attendi...",
    },
    drawer: {
      title: "Con quale gestore vuoi pagare?",
      body: "In questa lista trovi tutti i gestori compatibili con il tuo metodo, anche se non sei loro cliente.",
      header: {
        name: "Gestore",
        amount: "Costo transazione",
      },
    },
    disclaimer: {
      cheaper: "Suggerito perché il più economico",
      yourCard: "Perché gestisce la tua carta",
    },
  },
  paymentResponsePage: {
    "0": {
      title: "Grazie, hai pagato {{amount}}!",
      body: "Abbiamo inviato l’esito del pagamento a {{useremail}}",
    },
    "1": {
      title: "Spiacenti, si è verificato un errore imprevisto.",
      body: "Non è stato addebitato alcun importo.",
    },
    "2": {
      title: "Autorizzazione negata",
      body: "La tua banca non ha autorizzato l'operazione. Controlla di aver inserito correttamente i vari codici richiesti dalla tua banca.",
    },
    "3": {
      title: "I dati della carta non risultano corretti",
      body: "Controlla di aver inserito correttamente i dati della tua carta. L'intestatario deve coincidere esattamente con quanto riportato sulla carta.",
    },
    "4": {
      title: "Spiacenti, la sessione è scaduta",
      body: "Non è stato addebitato alcun importo. Per la tua sicurezza, hai a disposizione 5 minuti per completare l'operazione.",
    },
    "7": {
      title: "C’è un problema con la tua carta",
      body: "Non è stato addebitato alcun importo. Per maggiori informazioni, contatta la tua banca.",
    },
    "8": {
      title: "L’operazione è stata annullata",
      body: "",
    },
    "10": {
      title: "Autorizzazione negata",
      body: "Probabilmente hai superato il massimale della tua carta. Verifica con la tua banca prima di riprovare.",
    },
  },
  cancelledPage: {
    body: "L'operazione è stata annullata",
    button: "Chiudi",
  },
  koPage: {
    title: "Spiacenti, si è verificato un errore imprevisto",
    body: "Non è stato addebitato alcun importo.",
    button: "Chiudi",
  },
  app: {
    title: "Paga un avviso - pagoPA",
  },
  ariaLabels: {
    languageMenu: "Lingua impostata",
    appLanguage: "Imposta lingua",
    close: "Chiudi",
    editPsp: "Modifica PSP",
    editCard: "Modifica dati carta",
    editDonation: "Modifica ente donazione",
    informationDialog: "Informazioni",
    informationLink: "Per saperne di più sulla campagna di",
    loading: "Caricamento",
  },
  donationPage: {
    title: "Dona per la crisi in Ucraina",
    description:
      "Hai tempo fino al 23 dicembre. Puoi donare con carta senza costi di commissione. L’importo verrà versato direttamente sul conto dell’organizzazione a cui scegli di donare.",
    entity: "A chi vuoi donare?",
    volunteer: "Quanto vuoi donare?",
    submitCard: "Dona con carta",
    submitIO: "Dona con IO",
    ioDescription:
      "Dona con l’app IO per ricevere un’e-mail con i dati utili ai fini delle agevolazioni fiscali.",
    modalTitle: "Continua sull'app IO",
    openSection: "Apri la sezione",
    portfolio: "Portafoglio",
    click: "premi",
    payNotice: "Paga un avviso",
    code: "e inquadra il codice:",
    modalBody2: "Puoi donare senza costi di commissione con le tue carte.",
    dismissTitle: "Il servizio non è più attivo",
    dismissDescription:
      "Se vuoi puoi donare a una delle organizzazioni umanitarie che avevano aderito all’iniziativa.",
    dismissCTA: "Vedi le organizzazioni",
  },
  paymentMethods: {
    cp: "Carta di debito o credito",
    ppay: "Postepay",
    bpay: "Bancomat pay",
    cc: "Conto corrente",
  },
};
