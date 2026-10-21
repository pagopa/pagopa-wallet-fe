/* eslint-disable functional/immutable-data, no-underscore-dangle */
import * as E from "fp-ts/Either";

const validEnv = {
  WALLET_CONFIG_API_BASEPATH: "/v1",
  WALLET_CONFIG_API_ENV: "DEV",
  WALLET_CONFIG_API_HOST: "http://localhost",
  WALLET_CONFIG_API_PM_BASEPATH: "/pm",
  WALLET_CONFIG_API_TIMEOUT: "10000",
  WALLET_CONFIG_WEBVIEW_PM_HOST: "http://localhost",
  WALLET_GDI_CHECK_TIMEOUT: "20000",
  WALLET_NPG_SDK_INTEGRITY_URL: "http://localhost/sdk.integrity.json",
  WALLET_NPG_SDK_URL: "http://localhost/sdk",
  WALLET_OUTCOME_API_BASEPATH: "/api",
  WALLET_PAGOPA_LOGOS_CDN: "http://localhost/cdn",
  WALLET_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS: "2000",
  WALLET_CONTEXTUAL_ONBOARDING_ECOMMERCE_FE_OUTCOME_URL:
    "http://localhost/esito"
};

// jest.setup.js mocks the config module: load the real one, fresh per test,
// because it decodes window._env_ once at import.
const decodeEnv = (env: Record<string, string | undefined>) => {
  (window as any)._env_ = env;
  // eslint-disable-next-line functional/no-let
  let result: any;
  jest.isolateModules(() => {
    result = jest.requireActual("../config").getConfig();
  });
  return result;
};

describe("config", () => {
  afterEach(() => {
    delete (window as any)._env_;
  });

  it("accepts a full configuration", () => {
    expect(E.isRight(decodeEnv(validEnv))).toBe(true);
  });

  it.each([
    ["empty", ""],
    ["absent", undefined]
  ])(
    "accepts an %s NPG SDK integrity URL (SRI disabled)",
    (_label, integrityUrl) => {
      expect(
        E.isRight(
          decodeEnv({ ...validEnv, WALLET_NPG_SDK_INTEGRITY_URL: integrityUrl })
        )
      ).toBe(true);
    }
  );

  it("rejects an empty NPG SDK URL", () => {
    expect(E.isLeft(decodeEnv({ ...validEnv, WALLET_NPG_SDK_URL: "" }))).toBe(
      true
    );
  });
});
