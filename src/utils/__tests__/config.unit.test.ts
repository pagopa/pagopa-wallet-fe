/* eslint-disable functional/immutable-data */
import { getConfigOrThrow as getValidConfig } from "../../config";

// eslint-disable-next-line no-underscore-dangle
delete (window as any)._env_.WALLET_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS;
/* eslint-disable functional/immutable-data */
import { getConfigOrThrow as getFallbackConfig } from "../../config";

describe("Env config initialization", () => {
  it("Should return all configs value correctly", () => {
    const config = getValidConfig();
    expect(config.WALLET_CONFIG_API_BASEPATH).toEqual(
      "/webview-payment-wallet/v1"
    );
    expect(config.WALLET_CONFIG_API_ENV).toEqual("DEV");
    expect(config.WALLET_CONFIG_API_HOST).toEqual("http://localhost");
    expect(config.WALLET_CONFIG_API_PM_BASEPATH).toEqual("/pp-restapi-CD");
    expect(config.WALLET_CONFIG_API_TIMEOUT).toEqual(10000);
    expect(config.WALLET_CONFIG_WEBVIEW_PM_HOST).toEqual(
      "https://api.dev.platform.pagopa.it"
    );
    expect(config.WALLET_GDI_CHECK_TIMEOUT).toEqual(30000);
    expect(config.WALLET_NPG_SDK_URL).toEqual(
      "https://stg-ta.nexigroup.com/monetaweb/resources/hfsdk.js"
    );
    expect(config.WALLET_OUTCOME_API_BASEPATH).toEqual("/payment-wallet");
    expect(config.WALLET_PAGOPA_LOGOS_CDN).toEqual(
      "https://assets.cdn.io.italia.it/logos/abi"
    );
    expect(config.WALLET_ONBOARD_SWITCH_ON_PAYMENT_PAGE).toEqual(true);
    expect(config.WALLET_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS).toEqual(2000);
  });

  it("Should return default value of WALLET_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS", () => {
    const config = getFallbackConfig();
    expect(config.WALLET_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS).toEqual(2000);
  });
});
