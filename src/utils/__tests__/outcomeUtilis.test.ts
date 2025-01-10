import "jest-location-mock";
import utils from "..";
import { OUTCOME_ROUTE } from "../../routes/models/routeModel";

describe("getOnboardingOutcome function utility", () => {
  it("Should return the correct outcome from number", () => {
    expect(utils.outcome.getOnboardingOutcome(0)).toBe(OUTCOME_ROUTE.SUCCESS);
    expect(utils.outcome.getOnboardingOutcome(1)).toBe(
      OUTCOME_ROUTE.GENERIC_ERROR
    );
    expect(utils.outcome.getOnboardingOutcome(2)).toBe(
      OUTCOME_ROUTE.AUTH_ERROR
    );
    expect(utils.outcome.getOnboardingOutcome(3)).toBe(
      OUTCOME_ROUTE.INVALID_DATA
    );
    expect(utils.outcome.getOnboardingOutcome(4)).toBe(OUTCOME_ROUTE.TIMEOUT);
    expect(utils.outcome.getOnboardingOutcome(7)).toBe(
      OUTCOME_ROUTE.INVALID_CARD
    );
    expect(utils.outcome.getOnboardingOutcome(8)).toBe(
      OUTCOME_ROUTE.CANCELED_BY_USER
    );
    expect(utils.outcome.getOnboardingOutcome(14)).toBe(
      OUTCOME_ROUTE.INVALID_SESSION
    );
    expect(utils.outcome.getOnboardingOutcome(15)).toBe(
      OUTCOME_ROUTE.ALREADY_ONBOARDED
    );
    expect(utils.outcome.getOnboardingOutcome(16)).toBe(
      OUTCOME_ROUTE.PSP_ERROR
    );
    expect(utils.outcome.getOnboardingOutcome(25)).toBe(
      OUTCOME_ROUTE.GENERIC_ERROR
    );
    expect(utils.outcome.getOnboardingOutcome(116)).toBe(
      OUTCOME_ROUTE.BALANCE_LIMIT
    );
    expect(utils.outcome.getOnboardingOutcome(117)).toBe(
      OUTCOME_ROUTE.CVV_ERROR
    );
    expect(utils.outcome.getOnboardingOutcome(121)).toBe(
      OUTCOME_ROUTE.LIMIT_EXCEEDED
    );
    expect(utils.outcome.getOnboardingOutcome(undefined)).toBe(
      OUTCOME_ROUTE.GENERIC_ERROR
    );
  });
});
