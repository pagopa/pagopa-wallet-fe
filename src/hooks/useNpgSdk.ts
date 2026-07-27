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
     * NPG SDK loader with Subresource Integrity (SRI) check.
     *
     * This hook is the single place where the NPG SDK is injected. The SDK is
     * served from a pagoPA-controlled CDN (the platform CDN) together with its
     * integrity hash, published atomically by a scheduled job. We fetch the
     * published hash and load the SDK with the `integrity` attribute set, for
     * PCI SAQ-A compliance. The SDK is served cross-origin (platform CDN vs the
     * wallet host), so the script is loaded with `crossorigin="anonymous"`: the
     * browser cannot validate SRI on a cross-origin resource fetched without
     * CORS.
     *
     * No permissive fallback: if the hash cannot be fetched or SRI validation
     * fails, the SDK is intentionally NOT loaded, `sdkReady` stays false and
     * `buildSdk` stays a noop, so no payment can use an unvalidated SDK.
     */
    const loadNpgSdk = async () => {
      const config = getConfigOrThrow();
      const sdkUrl = config.WALLET_NPG_SDK_URL;
      const integrityUrl = config.WALLET_NPG_SDK_INTEGRITY_URL;

      try {
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

        const npgScriptEl = document.createElement("script");
        npgScriptEl.setAttribute("src", sdkUrl);
        npgScriptEl.setAttribute("type", "text/javascript");
        npgScriptEl.setAttribute("charset", "UTF-8");
        npgScriptEl.setAttribute("integrity", integrityHash);
        // Cross-origin load from the platform CDN: SRI can only be validated with CORS.
        npgScriptEl.setAttribute("crossorigin", "anonymous");
        npgScriptEl.addEventListener("load", () => setSdkReady(true));
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

    void loadNpgSdk();
  }, []);

  return { sdkReady, buildSdk: sdkReady ? createBuild : noop };
};
