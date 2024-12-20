/* eslint-disable functional/immutable-data */
import { getConfigOrThrow } from "../../config";
import { OUTCOME_ROUTE, ROUTE_FRAGMENT } from "../../routes/models/routeModel";
import urlUtils from "../../utils/urlUtilities";
import "jest-location-mock";

const { getFragments, redirectWithOutcome, redirectToIoAppForPayment } =
  urlUtils;
const {
  WALLET_CONFIG_API_HOST: API_HOST,
  WALLET_OUTCOME_API_BASEPATH: WALLET_OUTCOME_BASEPATH
} = getConfigOrThrow();

describe("getFragments function utility", () => {
  it("Should return all the params value correctly", () => {
    window.location.href =
      "https://localhost:1234#sessionToken=test&walletId=111";
    expect(
      getFragments(ROUTE_FRAGMENT.SESSION_TOKEN, ROUTE_FRAGMENT.WALLET_ID)
    ).toEqual({ sessionToken: "test", walletId: "111" });
  });

  it("Should the params with empty strings values if not found", () => {
    window.location.href = "https://localhost:1234#walletId=111";
    expect(
      getFragments(ROUTE_FRAGMENT.SESSION_TOKEN, ROUTE_FRAGMENT.WALLET_ID)
    ).toEqual({ sessionToken: "", walletId: "111" });
  });
});

describe("redirectWithOutcome function utility", () => {
  it("Should redirect to the correct url and correct outcome", () => {
    redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);
    expect(global.location.href).toContain("outcome=1");
    redirectWithOutcome(OUTCOME_ROUTE.AUTH_ERROR);
    expect(global.location.href).toContain("outcome=14");
    redirectWithOutcome(OUTCOME_ROUTE.CONFLICT);
    expect(global.location.href).toContain("outcome=15");
    redirectWithOutcome(OUTCOME_ROUTE.SUCCESS);
    expect(global.location.href).toContain("outcome=0");
    expect(global.location.href).not.toContain("walletId");
    redirectWithOutcome(OUTCOME_ROUTE.SUCCESS, "12345");
    expect(global.location.href).toContain("outcome=0&walletId=12345");
    redirectWithOutcome(OUTCOME_ROUTE.SUCCESS, 12345);
    expect(global.location.href).toContain(
      "outcome=0&walletId=00000000-0000-4000-0000-000000003039"
    );
    redirectWithOutcome(OUTCOME_ROUTE.SUCCESS, undefined);
    expect(global.location.href).not.toContain("walletId");
    expect(global.location.href).toContain("outcome=0");
  });
});

describe("redirectToIoAppForPayment function utility", () => {
  it("Should redirect to the correct url", () => {
    redirectToIoAppForPayment("12345", OUTCOME_ROUTE.GENERIC_ERROR, true);
    expect(global.location.href).toBe(
      `${API_HOST}${WALLET_OUTCOME_BASEPATH}/transactions/wallets/12345/outcomes?outcome=1&saveMethod=true`
    );
    redirectToIoAppForPayment("12345", OUTCOME_ROUTE.GENERIC_ERROR, false);
    expect(global.location.href).toBe(
      `${API_HOST}${WALLET_OUTCOME_BASEPATH}/transactions/wallets/12345/outcomes?outcome=1&saveMethod=false`
    );
    redirectToIoAppForPayment("12345", OUTCOME_ROUTE.SUCCESS);
    expect(global.location.href).toBe(
      `${API_HOST}${WALLET_OUTCOME_BASEPATH}/transactions/wallets/12345/outcomes?outcome=0`
    );
  });
});
