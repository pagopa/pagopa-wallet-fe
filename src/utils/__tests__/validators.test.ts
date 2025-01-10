import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import validators from "../../utils/validators";
import { npgSessionFieldsResponse } from "../testUtils";
import "jest-location-mock";
import { ErrorsType } from "../errors/errorsModel";

const {
  evaluateHTTPFamilyStatusCode,
  cardNameValidation,
  digitValidation,
  expirationDateChangeValidation,
  validateSessionWalletCardFormFields,
  statusCodeValidator,
  badStatusHandler
} = validators;

describe("evaluateHTTPFamilyStatusCode function", () => {
  it("Should evaluate the correct HTTP family code", () => {
    expect(evaluateHTTPFamilyStatusCode(100)).toEqual(
      O.some({ actualCode: 100, familyCode: "1xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(101)).toEqual(
      O.some({ actualCode: 101, familyCode: "1xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(199)).toEqual(
      O.some({ actualCode: 199, familyCode: "1xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(200)).toEqual(
      O.some({ actualCode: 200, familyCode: "2xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(201)).toEqual(
      O.some({ actualCode: 201, familyCode: "2xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(299)).toEqual(
      O.some({ actualCode: 299, familyCode: "2xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(400)).toEqual(
      O.some({ actualCode: 400, familyCode: "4xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(401)).toEqual(
      O.some({ actualCode: 401, familyCode: "4xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(404)).toEqual(
      O.some({ actualCode: 404, familyCode: "4xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(499)).toEqual(
      O.some({ actualCode: 499, familyCode: "4xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(500)).toEqual(
      O.some({ actualCode: 500, familyCode: "5xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(501)).toEqual(
      O.some({ actualCode: 501, familyCode: "5xx" })
    );
    expect(evaluateHTTPFamilyStatusCode(599)).toEqual(
      O.some({ actualCode: 599, familyCode: "5xx" })
    );
  });
  it("Should return an instance of O.none with a wrong input", () => {
    expect(evaluateHTTPFamilyStatusCode(-1)).toEqual(O.none);
    expect(evaluateHTTPFamilyStatusCode(-0)).toEqual(O.none);
    expect(evaluateHTTPFamilyStatusCode(0)).toEqual(O.none);
    expect(evaluateHTTPFamilyStatusCode(99)).toEqual(O.none);
    expect(evaluateHTTPFamilyStatusCode(600)).toEqual(O.none);
  });
});

describe("cardNameValidation function", () => {
  it("Should test correctly a right input", () => {
    expect(cardNameValidation("Name Test")).toEqual(true);
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
    expect(expirationDateChangeValidation("a")).toEqual(false);
    expect(expirationDateChangeValidation("0/")).toEqual(false);
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
        npgSessionFieldsResponse.sessionData.cardFormFields[1],
        npgSessionFieldsResponse.sessionData.cardFormFields[2],
        npgSessionFieldsResponse.sessionData.cardFormFields[3]
      ])
    ).toEqual(O.none);

    expect(
      validateSessionWalletCardFormFields([
        npgSessionFieldsResponse.sessionData.cardFormFields[1],
        npgSessionFieldsResponse.sessionData.cardFormFields[2],
        npgSessionFieldsResponse.sessionData.cardFormFields[3],
        npgSessionFieldsResponse.sessionData.cardFormFields[3]
      ])
    ).toEqual(O.none);
  });

  it("Should validate correctly a good input", () => {
    expect(
      validateSessionWalletCardFormFields(
        npgSessionFieldsResponse.sessionData.cardFormFields
      )
    ).toEqual(O.some(npgSessionFieldsResponse.sessionData.cardFormFields));
  });
});

describe("statusCodeValidator", () => {
  it("Returns a left familyCode on status code different from 200", () => {
    const result = statusCodeValidator(500);
    expect(result).toEqual(E.left({ familyCode: "5xx", actualCode: 500 }));
  });

  it("Returns a left 5xx familyCode on invalid status code", () => {
    const result = statusCodeValidator(700);
    expect(result).toEqual(E.left({ familyCode: "5xx", actualCode: 700 }));
  });

  it("Returns a right 2xx familyCode on 200 status code", () => {
    const result = statusCodeValidator(200);
    expect(result).toEqual(E.right({ familyCode: "2xx", actualCode: 200 }));
  });
});

describe("badStatusHandler", () => {
  it("Returns a generic error error on a 4xx status code", () => {
    const result = badStatusHandler({ familyCode: "4xx", actualCode: 400 });
    expect(result).toEqual(ErrorsType.GENERIC_ERROR);
  });

  it("Redirect with outcome 2 on a 401 status code", () => {
    const result = badStatusHandler({ familyCode: "4xx", actualCode: 401 });
    expect(result).toEqual(ErrorsType.GENERIC_ERROR);
    expect(global.location.href).toContain("outcome=2");
  });

  it("Redirect with outcome 1 on a 4xx status code", () => {
    badStatusHandler({ familyCode: "4xx", actualCode: 400 });
    expect(global.location.href).toContain("outcome=1");
    badStatusHandler({ familyCode: "4xx", actualCode: 405 });
    expect(global.location.href).toContain("outcome=1");
    badStatusHandler({ familyCode: "4xx", actualCode: 404 });
    expect(global.location.href).toContain("outcome=1");
    badStatusHandler({ familyCode: "4xx", actualCode: 401 });
    expect(global.location.href).toContain("outcome=2");
  });

  it("Returns GENERIC_ERROR on any other status code", () => {
    const result = badStatusHandler({ familyCode: "5xx", actualCode: 500 });
    expect(result).toEqual(ErrorsType.GENERIC_ERROR);
  });
});
