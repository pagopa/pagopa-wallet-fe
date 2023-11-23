import "whatwg-fetch";
import "jest-location-mock";
import { useOutcomeRedirect } from "../../hooks/useOutcomeRedirect";
import { OUTCOME_ROUTE } from "../../routes/models/routeModel";

describe("useOutcomeRedirect hook", () => {
  it("should redirect to curry input", () => {
    const outcome = useOutcomeRedirect();
    outcome(OUTCOME_ROUTE.SUCCESS);
    expect(global.location.href).toContain(OUTCOME_ROUTE.SUCCESS);
  });

  it("should redirect to initial input", () => {
    const outcome = useOutcomeRedirect(OUTCOME_ROUTE.SUCCESS);
    outcome();
    expect(global.location.href).toContain(OUTCOME_ROUTE.SUCCESS);
  });
});
