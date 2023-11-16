import { WalletRequest } from "../../generated/definitions/payment-manager-v1/WalletRequest";
import { WalletResponse } from "../../generated/definitions/payment-manager-v1/WalletResponse";
import { TypeEnum } from "../../generated/definitions/payment-manager-v1/Wallet";
import { SessionWalletCreateResponse } from "../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { RestBPayResponse } from "../../generated/definitions/payment-manager-v1/RestBPayResponse";

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

export const bpayListItems: Exclude<RestBPayResponse["data"], undefined> = [
  {
    token: "e69b67f5319c24a6b3cc64f3d8347a7c78838532f7ccf4aaeda620a8c68e5503",
    groupCode: "89034",
    instituteCode: "05704",
    bankName: "CEDACRI - Banca popolare di Spoleto S.P.A.",
    nameObfuscated: "Eg**",
    surnameObfuscated: "Sgr***",
    numberObfuscated: "+3938*******202",
    numberEncrypted:
      "86d66bbcf38ab3cef51b30b511b27e24d11f2d5cec6262d5db53c9cc5d9fa22bfdc3abbbf61981f08fb6aa197ef21e2621b08fdb80507754ecf0c257c4be987d72715cb6cfdd21216f7b557b5331efb9afa86c10d23b58f3d17996d49696677a63e5f55770b87dca2c3f837aeb4ac7c2791bc3ac5d75ab3812d2fa29b287ff226448f1a250a4f9cadc680ffad3a6a5e4232153741718a758b97ec6a63c2f3d27201a2e5edee095736eb4b496cc96b2792d88a0b6886e71b51a1a3f258cdd10e22c7866f0bbec37a42bfd2bc36e1e1d4c09d28ba79fbe6d08d49f2484f5e53eafa891ab8407fded9eca8c15d112dfdb5cc577348b153d71001d99650ba8e912c4",
    uid: "6bcb1c1248c53779fbccc3d5a0f2393dece207e43e95880d3e4ac890a1bb0141fc5c0ef1ab9518d58584da78bfe4c006f6de5d2ae5a5aa4e340868fbe5a58ae8ceb56602f61bc60aebd3dfda8ce8696f58e2318713a3a599c2c0d891c90839f71123a04d6ca9f41094b3541019d528886f7771ccff27988aa423b0eaca18d5ce95cdaa4f337415c30ed6e36eaf0851e68cf6f090bf9c76b8dc146a6ab0a1acd181a61fcb5a84b69a3b9be78c92f9ee624f30f524145799e0469f8dd0cbae92f67cd5f39c37595618f7df72aac3819b0587aee0d5267c4ce64d92a6bf8d9dd12799ab58068a3160ae93885e9cc70ef97faa2c6336fae6984b85f2342d1a5edf3f",
    uidHash: "0e9c646a34cfe6da5687c618297007e2e5c85846c0e2d4800163f8c8d451a8f8",
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
