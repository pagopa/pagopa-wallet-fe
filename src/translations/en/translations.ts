export const TRANSLATIONS_EN = {
  mainPage: {
    footer: {
      accessibility: "Accessibility",
      help: "Help",
      pagoPA: "visit pagoPA site",
    },
    header: {
      disclaimer: "",
      detail: {
        detail: {
          detailTitle: "",
          detailAmount: "",
          detailSubject: "",
          detailReceiver: "",
          detailFC: "",
          detailIUV: "",
        },
      },
    },
  },
  privacyInfo: {
    privacyDesc:
      "On Continue you declare that you have read and understood the ",
    googleDesc: " Form protected by reCAPTCHA and Google",
    privacy: "Privacy Policy and Terms and conditions of use of the service.",
    privacyPolicy: "Privacy Policy",
    serviceTerms: "Terms of Service",
  },
  paymentNoticePage: {
    title: "What do you have to pay?",
    description: "Enter the data as shown on the payment notification.",
    helpLink: "See an example",
    formFields: {
      billCode: "Notification Code",
      cf: "Creditor Institution Tax Identification Number",
    },
    formErrors: {
      required: "Required field",
      minCode: "Enter 18 digits",
      minCf: "Enter 11 digits",
    },
    formButtons: {
      cancel: "Back",
      submit: "Continue",
    },
  },
  paymentSummaryPage: {
    title: "Payment Notice",
    description:
      "pagoPA automatically updates the amount to ensure that you have paid exactly what is due and thus avoid overdrafts or other interests.",
    amount: "Updated amount",
    creditor: "Creditor Institution",
    causal: "Causal",
    cf: "Creditor Institution tax code",
    iuv: "IUV Code",
    buttons: {
      cancel: "Back",
      submit: "Pay this notice",
    },
  },
  paymentEmailPage: {
    title: "Enter your email",
    description: "You will receive the payment result at this address",
    formFields: {
      email: "Email address",
      confirmEmail: "Confirm your email address",
    },
    formErrors: {
      required: "Required field",
      invalid: "Enter a valid email address",
      notEqual: "Email address should be the same",
    },
    formButtons: {
      submit: "Continue",
      cancel: "Cancel",
    },
  },
  general: {
    and: "&",
  },
  app: {
    title: "Pay a notice - pagoPA",
  },
  ariaLabels: {
    languageMenu: "Current language",
    appLanguage: "Select language",
    close: "Close",
    editPsp: "Change PSP",
    editCard: "Edit credit card",
    informationDialog: "Informations",
    loading: "Loading",
  },
};
