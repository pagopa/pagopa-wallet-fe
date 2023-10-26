import { WalletRequest } from "../../../generated/definitions/payment-manager-v1/WalletRequest";
import { WalletResponse } from "../../../generated/definitions/payment-manager-v1/WalletResponse";
import { TypeEnum } from "../../../generated/definitions/payment-manager-v1/Wallet";
import { SessionWalletCreateResponse } from "../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";

export const idWallet = 1222302;
export const walletId = "1222302";
export const orderId = "1222302";

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

export const sessionToken =
  "8s9Q5k9f6L7a1w8C8b4e9F3a4o6I7f9k9B7s2h9K8i8a3E9n3i4B4z5d2S5n9v6Q4t3n2H8i8y5A7k9j9N5y6p9C8r7r0G5c3o3N6w9c5H2f3p3C3v4v4Y6p1x5I5s4v";

const walletResponse: WalletResponse = {
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

export const npgSessionFieldsResponse: SessionWalletCreateResponse = {
  orderId,
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
