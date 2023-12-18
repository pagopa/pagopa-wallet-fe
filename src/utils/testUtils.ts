import { WalletRequest } from "../../generated/definitions/payment-manager-v1/WalletRequest";
import { WalletResponse } from "../../generated/definitions/payment-manager-v1/WalletResponse";
import { TypeEnum } from "../../generated/definitions/payment-manager-v1/Wallet";
import { RestBPayResponse } from "../../generated/definitions/payment-manager-v1/RestBPayResponse";
import { WalletTypeEnum } from "../../generated/definitions/payment-manager-v1/WalletV2";
import { WalletV2ListResponse } from "../../generated/definitions/payment-manager-v1/WalletV2ListResponse";
import { EnableableFunctionsEnum } from "../../generated/definitions/payment-manager-v1/EnableableFunctions";
import { SessionWalletRetrieveResponse } from "../../generated/definitions/webview-payment-wallet/SessionWalletRetrieveResponse";
import { BundleOption } from "../../generated/definitions/webview-payment-wallet/BundleOption";
import { SessionWalletCreateResponseData1 } from "../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponseData";

export const idWallet = 1222302;
export const walletId = "1222302";
export const orderId = "1222302";
export const paymentMethodId = "9d735400-9450-4f7e-9431-8c1e7fa2a339";

export const walletRequest: WalletRequest = {
  data: {
    creditCard: {
      holder: "Pippo Baudo",
      securityCode: "123",
      pan: "4242424242424242",
      expireMonth: "11",
      expireYear: "23"
    },
    type: TypeEnum.CREDIT_CARD
  }
};

export const sessionToken = "tokenTest";

export const walletResponse: WalletResponse = {
  data: {
    idWallet,
    type: TypeEnum.CREDIT_CARD,
    favourite: false,
    creditCard: {
      id: 1157851,
      holder: "a b",
      pan: "************4242",
      expireMonth: "01",
      expireYear: "32",
      brandLogo:
        "https://api.dev.platform.pagopa.it/wallet/assets/img/creditcard/generic.png",
      flag3dsVerified: false,
      brand: "OTHER",
      onUs: false
    },
    pspEditable: true,
    onboardingChannel: "IO",
    services: ["pagoPA", "BPD", "FA"],
    isPspToIgnore: false,
    registeredNexi: false,
    saved: false
  }
};

export const walletResponseBody = JSON.stringify(walletResponse);

export const npgSessionFieldsResponse: {
  orderId: string;
  sessionData: {
    paymentMethodType: "cards";
    cardFormFields: SessionWalletCreateResponseData1["cardFormFields"];
  };
} = {
  orderId,
  sessionData: {
    paymentMethodType: "cards",
    cardFormFields: [
      {
        type: "TEXT",
        class: "CARD_FIELD",
        id: "CARD_NUMBER",
        src: "https://stg-ta.nexigroup.com/phoenix-0.0/v3/?id=CARD_NUMBER&lang=ITA&correlationid=2ebf3248-2967-4c26-aeb6-4ed8e044ae84&sessionid=iMPAbSadjGtfiSLLiQ77qg%3D%3D&placeholder=Y"
      },
      {
        type: "TEXT",
        class: "CARD_FIELD",
        id: "EXPIRATION_DATE",
        src: "https://stg-ta.nexigroup.com/phoenix-0.0/v3/?id=EXPIRATION_DATE&lang=ITA&correlationid=2ebf3248-2967-4c26-aeb6-4ed8e044ae84&sessionid=iMPAbSadjGtfiSLLiQ77qg%3D%3D&placeholder=Y"
      },
      {
        type: "TEXT",
        class: "CARD_FIELD",
        id: "SECURITY_CODE",
        src: "https://stg-ta.nexigroup.com/phoenix-0.0/v3/?id=SECURITY_CODE&lang=ITA&correlationid=2ebf3248-2967-4c26-aeb6-4ed8e044ae84&sessionid=iMPAbSadjGtfiSLLiQ77qg%3D%3D&placeholder=Y"
      },
      {
        type: "TEXT",
        class: "CARD_FIELD",
        id: "CARDHOLDER_NAME",
        src: "https://stg-ta.nexigroup.com/phoenix-0.0/v3/?id=CARDHOLDER_NAME&lang=ITA&correlationid=2ebf3248-2967-4c26-aeb6-4ed8e044ae84&sessionid=iMPAbSadjGtfiSLLiQ77qg%3D%3D&placeholder=Y"
      }
    ]
  }
};

export const npgSessionFieldsResponseBody = JSON.stringify(
  npgSessionFieldsResponse
);

export const walletValidationsResponse = {
  details: {
    iframeUrl:
      "aHR0cHM6Ly9zdGctdGEubmV4aWdyb3VwLmNvbS9waG9lbml4LTAuMC92My8/aWQ9Z2RpJmxhbmc9SVRBJmNvcnJlbGF0aW9uaWQ9OGEwZjg5ZGItMmVlNi00ZGIxLTk2MTctZTM3NDVmNDBmYTZkJnNlc3Npb25pZD1heDNXbzN3aUhxWUVqUE16VnhFVVBBJTNEJTNEJnBsYWNlaG9sZGVyPVk=",
    type: "CARD"
  },
  orderId: "1c6d2265-dd49-4"
};

export const walletValidationsResponseBody = JSON.stringify(
  walletValidationsResponse
);

export const getSessionWalletResponse: SessionWalletRetrieveResponse = {
  orderId,
  walletId,
  isFinalOutcome: true,
  outcome: 2
};

export const getSessionWalletResponseBody = JSON.stringify(
  getSessionWalletResponse
);

export const bpayListItems: Exclude<RestBPayResponse["data"], undefined> = [
  {
    token: "testToken",
    groupCode: "1234",
    instituteCode: "1234",
    bankName: "bank test name",
    nameObfuscated: "Eg**",
    surnameObfuscated: "Sgr***",
    numberObfuscated: "+3938*******202",
    numberEncrypted: "testEncrypted",
    uid: "testUid",
    uidHash: "testUidHash",
    serviceState: "ATT",
    paymentInstruments: [
      {
        ibanObfuscated: "IT**********2201",
        defaultSend: true,
        defaultReceive: true
      }
    ]
  }
];

export const walletItems: WalletV2ListResponse = {
  data: [
    {
      idWallet: 1302262,
      walletType: WalletTypeEnum.BPay,
      enableableFunctions: [
        EnableableFunctionsEnum.pagoPA,
        EnableableFunctionsEnum.BPD,
        EnableableFunctionsEnum.FA
      ],
      pagoPA: true,
      onboardingChannel: "IO",
      favourite: false,
      createDate: new Date("2023-11-16 10:16:09"),
      info: {
        type: "BPayInfo",
        instituteCode: "1234",
        bankName: "Bank test name",
        numberObfuscated: "+3938*******202",
        vidHash: "testVidHash",
        paymentInstruments: [
          {
            defaultSend: true,
            defaultReceive: true
          }
        ],
        brandLogo: ""
      }
    }
  ]
};

export const pspsResponse = {
  data: [
    {
      idPsp: "IDPSPFNZ",
      codiceAbi: "06220",
      ragioneSociale: "Psp Ila",
      maxFee: 102,
      avgFee: 101,
      privacyUrl: "http://example.com",
      onboard: false
    },
    {
      idPsp: "PAYTITM1",
      codiceAbi: "36017",
      ragioneSociale: "Paytipper Spa",
      maxFee: 150,
      avgFee: 150,
      privacyUrl: "https://www.paytipper.com/srvs/AI/show_informative",
      onboard: false
    },
    {
      idPsp: "40000000001",
      codiceAbi: "40001",
      ragioneSociale:
        "Cassa di Risparmio di Parma e Piacenza S.p.A. descrizione lunga",
      maxFee: 603,
      avgFee: 403,
      privacyUrl: "test",
      onboard: false
    },
    {
      idPsp: "60000000001",
      codiceAbi: "40001",
      ragioneSociale: "PSP Paolo",
      maxFee: 603,
      avgFee: 403,
      privacyUrl: "https://www.paytipper.com/srvs/AI/show_informative",
      onboard: false
    },
    {
      idPsp: "70000000001",
      codiceAbi: "70001",
      ragioneSociale: "Psp Salvo",
      maxFee: 603,
      avgFee: 403,
      privacyUrl: "test",
      onboard: false
    },
    {
      idPsp: "50000000001",
      codiceAbi: "50001",
      ragioneSociale: "Psp Davide",
      maxFee: 603,
      avgFee: 403,
      privacyUrl: "https://www.paytipper.com/srvs/AI/show_informative",
      onboard: false
    }
  ]
};

export const pspsResponseBody = JSON.stringify(pspsResponse);

export const getPspsForWalletResponse: BundleOption = {
  belowThreshold: false,
  bundleOptions: [
    {
      taxPayerFee: 45,
      primaryCiIncurredFee: 0,
      paymentMethod: "PPAL",
      touchpoint: "IO",
      idBundle: "123eret-1234-4372",
      bundleName: "bundleName Italia S.p.A.",
      bundleDescription: "Pagamenti con carte",
      idPsp: "IDPSP",
      idChannel: "2342342_01",
      idBrokerPsp: "2342342",
      onUs: false,
      abi: "123456",
      pspBusinessName: "pspBusinessName Italia S.p.A."
    },
    {
      taxPayerFee: 45,
      primaryCiIncurredFee: 0,
      paymentMethod: "PPAL",
      touchpoint: "IO",
      idBundle: "456eret-1234-2345",
      bundleName: "bundleName2 Italia S.p.A.",
      bundleDescription: "Pagamenti con carte",
      idPsp: "IDPSP2",
      idChannel: "2342342_02",
      idBrokerPsp: "2342343",
      onUs: false,
      abi: "123433",
      pspBusinessName: "pspBusinessName2 Italia S.p.A."
    }
  ]
};

export const getPspsForWalletResponseBody = JSON.stringify(
  getPspsForWalletResponse
);
