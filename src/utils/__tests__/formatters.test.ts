import formatters from "../formatters";

const { moneyFormat, cleanSpaces, expireDateFormatter } = formatters;

describe("MoneyFormat function utility", () => {
  it("should format correctly", () => {
    expect(moneyFormat(50)).toEqual("0,50\xa0€");
    expect(moneyFormat(501)).toEqual("5,01\xa0€");
    expect(moneyFormat(0)).toEqual("0,00\xa0€");
    expect(moneyFormat(-0)).toEqual("0,00\xa0€");
    expect(moneyFormat(0, 2)).toEqual("0,00\xa0€");
    expect(moneyFormat(550)).toEqual("5,50\xa0€");
    expect(moneyFormat(550, 2)).toEqual("5,50\xa0€");
    expect(moneyFormat(55.67, 2, 3)).toEqual("0,557\xa0€");
    expect(moneyFormat(55.67, 2)).toEqual("0,56\xa0€");
    expect(moneyFormat(127, 2, 3)).toEqual("1,270\xa0€");
    expect(moneyFormat(1, 0)).toEqual("1,00\xa0€");
    expect(moneyFormat(-55)).toEqual("-0,55\xa0€");
    expect(moneyFormat(-5, 0)).toEqual("-5,00\xa0€");
  });
});

describe("cleanSpaces function utility", () => {
  it("remove spaces correctly", () => {
    expect(cleanSpaces(" ")).toEqual("");
    expect(cleanSpaces("    ")).toEqual("");
    expect(cleanSpaces("a b c")).toEqual("abc");
    expect(cleanSpaces(" a b c ")).toEqual("abc");
    expect(cleanSpaces("1 2 3")).toEqual("123");
    expect(cleanSpaces("1 2 3  ")).toEqual("123");
  });
});

describe("expireDateFormatter function utility", () => {
  it("format input correctly", () => {
    expect(expireDateFormatter("", "1/")).toEqual("01/");
    expect(expireDateFormatter("", "0/")).toEqual("00/");
    expect(expireDateFormatter("", "2")).toEqual("02");
    expect(expireDateFormatter("11", "111")).toEqual("11/1");
    expect(expireDateFormatter("", "11/2024")).toEqual("11/24");
    expect(expireDateFormatter("", "11/24")).toEqual("11/24");
  });
});
