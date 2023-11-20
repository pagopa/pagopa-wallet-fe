import "whatwg-fetch";
import "jest-location-mock";
import { useNpgOutcomeRedirect } from "../../hooks/useNpgOutcomeRedirect";
import { NPG_OUTCOME_ROUTE } from "../../routes/models/routeModel";

describe("useNpgOutcomeRedirect hook", () => {
  it("should redirect to curry input", () => {
    const outcome = useNpgOutcomeRedirect();
    outcome(NPG_OUTCOME_ROUTE.SUCCESS);
    expect(global.location.href).toContain(NPG_OUTCOME_ROUTE.SUCCESS);
  });

  it("should redirect to initial input", () => {
    const outcome = useNpgOutcomeRedirect(NPG_OUTCOME_ROUTE.SUCCESS);
    outcome();
    expect(global.location.href).toContain(NPG_OUTCOME_ROUTE.SUCCESS);
  });
});
