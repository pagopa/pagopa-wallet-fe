import * as O from "fp-ts/Option";
import validators from "../../utils/validators";
import { npgSessionFieldsResponse } from "../testUtils";

const {
  evaluateHTTPfamilyStatusCode,
  cardNameValidation,
  digitValidation,
  expirationDateChangeValidation,
  validateSessionWalletCardFormFields
} = validators;

describe("evaluateHTTPfamilyStatusCode function", () => {
  it("Should evaluate the correct HTTP family code", () => {
    expect(evaluateHTTPfamilyStatusCode(100)).toEqual(
      O.some({ actualCode: 100, familyCode: "1xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(101)).toEqual(
      O.some({ actualCode: 101, familyCode: "1xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(199)).toEqual(
      O.some({ actualCode: 199, familyCode: "1xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(200)).toEqual(
      O.some({ actualCode: 200, familyCode: "2xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(201)).toEqual(
      O.some({ actualCode: 201, familyCode: "2xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(299)).toEqual(
      O.some({ actualCode: 299, familyCode: "2xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(400)).toEqual(
      O.some({ actualCode: 400, familyCode: "4xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(401)).toEqual(
      O.some({ actualCode: 401, familyCode: "4xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(404)).toEqual(
      O.some({ actualCode: 404, familyCode: "4xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(499)).toEqual(
      O.some({ actualCode: 499, familyCode: "4xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(500)).toEqual(
      O.some({ actualCode: 500, familyCode: "5xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(501)).toEqual(
      O.some({ actualCode: 501, familyCode: "5xx" })
    );
    expect(evaluateHTTPfamilyStatusCode(599)).toEqual(
      O.some({ actualCode: 599, familyCode: "5xx" })
    );
  });
  it("Should return an istance of O.none with a wrong input", () => {
    expect(evaluateHTTPfamilyStatusCode(-1)).toEqual(O.none);
    expect(evaluateHTTPfamilyStatusCode(-0)).toEqual(O.none);
    expect(evaluateHTTPfamilyStatusCode(0)).toEqual(O.none);
    expect(evaluateHTTPfamilyStatusCode(99)).toEqual(O.none);
    expect(evaluateHTTPfamilyStatusCode(600)).toEqual(O.none);
  });
});

describe("cardNameValidation function", () => {
  it("Should test correctly a right input", () => {
    expect(cardNameValidation("Pippo Baudo")).toEqual(true);
  });
  it("Should test correctly a wrong input", () => {
    expect(cardNameValidation("")).toEqual(false);
    expect(cardNameValidation(" ")).toEqual(false);
    expect(cardNameValidation("111")).toEqual(false);
    expect(cardNameValidation("a")).toEqual(false);
  });
});

describe("digitValidation function", () => {
  it("Should test correctly a right input", () => {
    expect(digitValidation("0")).toEqual(true);
    expect(digitValidation("1")).toEqual(true);
    expect(digitValidation("01")).toEqual(true);
    expect(digitValidation("0010")).toEqual(true);
    expect(digitValidation("999999999")).toEqual(true);
  });
  it("Should test correctly a wrong input", () => {
    expect(digitValidation("-0")).toEqual(false);
    expect(digitValidation("-1")).toEqual(false);
    expect(digitValidation("1 1")).toEqual(false);
    expect(digitValidation("")).toEqual(false);
    expect(digitValidation(" ")).toEqual(false);
    expect(digitValidation("a")).toEqual(false);
  });
});

describe("expirationDateChangeValidation function", () => {
  it("Should test correctly a right input", () => {
    expect(expirationDateChangeValidation("")).toEqual(true);
    expect(expirationDateChangeValidation("11/23")).toEqual(true);
  });
  it("Should test correctly a wrong input", () => {
    expect(expirationDateChangeValidation("1.1")).toEqual(false);
    expect(expirationDateChangeValidation("11.23")).toEqual(false);
    expect(expirationDateChangeValidation("11-23")).toEqual(false);
    expect(expirationDateChangeValidation("11 23")).toEqual(false);
    expect(expirationDateChangeValidation("1 2023")).toEqual(false);
    expect(expirationDateChangeValidation("abc")).toEqual(false);
  });
});

describe("validateSessionWalletCardFormFields function", () => {
  it("Should validate correctly a wrong input", () => {
    expect(validateSessionWalletCardFormFields([])).toEqual(O.none);

    expect(validateSessionWalletCardFormFields([{}, {}, {}, {}])).toEqual(
      O.none
    );

    expect(
      validateSessionWalletCardFormFields([
        npgSessionFieldsResponse.cardFormFields[1],
        npgSessionFieldsResponse.cardFormFields[2],
        npgSessionFieldsResponse.cardFormFields[3]
      ])
    ).toEqual(O.none);

    expect(
      validateSessionWalletCardFormFields([
        npgSessionFieldsResponse.cardFormFields[1],
        npgSessionFieldsResponse.cardFormFields[2],
        npgSessionFieldsResponse.cardFormFields[3],
        npgSessionFieldsResponse.cardFormFields[3]
      ])
    ).toEqual(O.none);
  });

  it("Should validate correctly a good input", () => {
    expect(
      validateSessionWalletCardFormFields(
        npgSessionFieldsResponse.cardFormFields
      )
    ).toEqual(O.some(npgSessionFieldsResponse.cardFormFields));
  });
});
