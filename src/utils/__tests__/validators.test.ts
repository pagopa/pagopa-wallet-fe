import * as O from "fp-ts/Option";
import validators from "../../utils/validators";

const { evaluateHTTPfamilyStatusCode } = validators;

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
