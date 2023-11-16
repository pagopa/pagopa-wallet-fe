/* eslint-disable functional/immutable-data */
/* eslint-disable no-underscore-dangle */
(window as any)._env_ = {
  WALLET_CONFIG_API_BASEPATH: "/webview-payment-wallet/v1",
  WALLET_CONFIG_API_PM_BASEPATH: "/pp-restapi-CD",
  WALLET_OUTCOME_API_BASEPATH: "/payment-wallet",
  WALLET_CONFIG_API_TIMEOUT: "10000",
  WALLET_CONFIG_API_ENV: "DEV",
  WALLET_CONFIG_API_HOST: "https://api.dev.platform.pagopa.it",
  WALLET_CONFIG_WEBVIEW_PM_HOST: "https://api.dev.platform.pagopa.it",
  WALLET_NPG_SDK_URL:
    "https://stg-ta.nexigroup.com/monetaweb/resources/hfsdk.js"
};

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
