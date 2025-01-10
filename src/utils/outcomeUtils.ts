import { OUTCOME_ROUTE } from "../routes/models/routeModel";

function getOnboardingOutcome(outcome: number | undefined): OUTCOME_ROUTE {
  switch (outcome) {
    case 0:
      return OUTCOME_ROUTE.SUCCESS;
    case 1:
      return OUTCOME_ROUTE.GENERIC_ERROR;
    case 2:
      return OUTCOME_ROUTE.AUTH_ERROR;
    case 3:
      return OUTCOME_ROUTE.INVALID_DATA;
    case 4:
      return OUTCOME_ROUTE.TIMEOUT;
    case 7:
      return OUTCOME_ROUTE.INVALID_CARD;
    case 8:
      return OUTCOME_ROUTE.CANCELED_BY_USER;
    case 14:
      return OUTCOME_ROUTE.INVALID_SESSION;
    case 15:
      return OUTCOME_ROUTE.ALREADY_ONBOARDED;
    case 16:
      return OUTCOME_ROUTE.ACCOUNT_BPAY_NOT_PRESENT;
    case 25:
      return OUTCOME_ROUTE.PSP_ERROR;
    case 116:
      return OUTCOME_ROUTE.BALANCE_LIMIT;
    case 117:
      return OUTCOME_ROUTE.CVV_ERROR;
    case 121:
      return OUTCOME_ROUTE.LIMIT_EXCEEDED;
  }
  return OUTCOME_ROUTE.GENERIC_ERROR;
}

export default {
  getOnboardingOutcome
};
