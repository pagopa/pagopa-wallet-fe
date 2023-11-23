import { EXTERNAL_OUTCOME, OUTCOME_ROUTE } from "../routes/models/routeModel";

export const useOutcomeRedirect =
  (outcome?: OUTCOME_ROUTE) => (curryOutcome?: OUTCOME_ROUTE) => {
    if (outcome || curryOutcome) {
      window.location.replace(`${EXTERNAL_OUTCOME}${outcome ?? curryOutcome}`);
    }
  };
