import { useEffect, useState } from "react";
import createBuildConfig from "../utils/buildConfig";
import { getConfigOrThrow } from "../config";
import { FieldId, FieldStatus } from "../features/onboard/components/types";

export type SdkBuild = {
  onChange?: (field: FieldId, fieldStatus: FieldStatus) => void;
  onReadyForPayment?: () => void;
  onPaymentComplete?: () => void;
  onPaymentRedirect?: (urlRedirect: string) => void;
  onBuildError: () => void;
  onAllFieldsLoaded?: () => void;
};

const noop = () => {
  // noop
};

export const useNpgSdk = ({
  onChange = () => null,
  onReadyForPayment = () => null,
  onPaymentComplete = () => null,
  onPaymentRedirect = () => null,
  onBuildError,
  onAllFieldsLoaded = () => null
}: SdkBuild) => {
  const [sdkReady, setSdkReady] = useState(false);

  const createBuild = (): typeof Build => {
    try {
      return new Build(
        createBuildConfig({
          onChange,
          onReadyForPayment,
          onPaymentRedirect,
          onPaymentComplete,
          onBuildError,
          onAllFieldsLoaded
        })
      );
    } catch (_e) {
      onBuildError();
    }
  };

  useEffect(() => {
    /**
     * NPG SDK loader, the single place where the SDK is injected. Two modes
     * selected by WALLET_NPG_SDK_INTEGRITY_URL (same semantics as checkout-fe):
     *
     * - set: fetch the published hash and load the SDK with `integrity` +
     *   `crossorigin="anonymous"` (the SDK is self-hosted on the platform CDN,
     *   cross-origin, so SRI needs CORS). Fail closed: no hash, no SDK, so
     *   `sdkReady` stays false and no payment can use an unvalidated SDK.
     * - empty: load the SDK from Nexi with no integrity (Nexi publishes no hash
     *   and sends no CORS). To disable SRI: blank the integrity URL, restore the
     *   Nexi SDK URL and redeploy.
     */
    const buildScript = (sdkUrl: string) => {
      const npgScriptEl = document.createElement("script");
      npgScriptEl.setAttribute("src", sdkUrl);
      npgScriptEl.setAttribute("type", "text/javascript");
      npgScriptEl.setAttribute("charset", "UTF-8");
      npgScriptEl.addEventListener("load", () => setSdkReady(true));
      return npgScriptEl;
    };

    const loadNpgSdk = async () => {
      const config = getConfigOrThrow();
      const sdkUrl = config.WALLET_NPG_SDK_URL;
      const integrityUrl = config.WALLET_NPG_SDK_INTEGRITY_URL;

      // Legacy mode -> no SRI enabled, load the SDK without integrity
      if (!integrityUrl) {
        document.head.appendChild(buildScript(sdkUrl));
        return;
      }

      try {
        // This is why the loader became async: `integrity` has to be on the tag
        // before it is appended, so the hash must be fetched first. It cannot be
        // added once the browser has started fetching the script.
        const response = await fetch(integrityUrl);
        if (!response.ok) {
          throw new Error(
            `Integrity endpoint returned HTTP ${response.status}`
          );
        }
        const { integrityHash } = (await response.json()) as {
          integrityHash?: string;
        };
        if (!integrityHash) {
          throw new Error("Integrity hash missing from response");
        }

        const npgScriptEl = buildScript(sdkUrl);
        npgScriptEl.setAttribute("integrity", integrityHash);
        // Cross-origin load from the platform CDN: SRI can only be validated with CORS.
        npgScriptEl.setAttribute("crossorigin", "anonymous");
        // SRI failure or load error: the SDK stays unloaded so no payment can use it.
        npgScriptEl.addEventListener("error", () => {
          // eslint-disable-next-line no-console
          console.error(
            "NPG SDK failed to load or failed SRI validation; SDK not loaded"
          );
        });
        document.head.appendChild(npgScriptEl);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load NPG SDK with integrity:", error);
      }
    };

    // A useEffect callback cannot itself be async, so the loader is defined above
    // and fired here; `void` marks the floating promise as deliberate.
    void loadNpgSdk();
  }, []);

  return { sdkReady, buildSdk: sdkReady ? createBuild : noop };
};
