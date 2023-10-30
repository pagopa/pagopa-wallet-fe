import {
  EXTERNAL_OUTCOME,
  NPG_OUTCOME_ROUTE
} from "../routes/models/routeModel";

export const useNpgOutcomeRedirect =
  (outcome?: NPG_OUTCOME_ROUTE) => (curryOutcome?: NPG_OUTCOME_ROUTE) => {
    if (outcome || curryOutcome) {
      window.location.replace(`${EXTERNAL_OUTCOME}${outcome || curryOutcome}`);
    }
  };
