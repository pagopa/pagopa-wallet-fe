import { useEffect, useState } from "react";
import createBuildConfig from "../utils/buildConfig";
import { FieldId, FieldStatus } from "../features/onboard/components/types";

/** Keep in sync with the event name used in src/npgsdk.js. */
const NPG_SDK_READY_EVENT = "npg-sdk-ready";

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

  /**
   * The NPG SDK is injected exactly once, with its Subresource Integrity (SRI)
   * check, by the standalone loader in src/npgsdk.js, which is included by
   * src/index.html and therefore runs on every page. This hook must NOT inject
   * a second copy: it only observes readiness.
   *
   * Two cases have to be covered, and the order between the loader and the
   * React bootstrap is not guaranteed:
   * - the SDK is still loading when this component mounts -> the loader will
   *   dispatch `npg-sdk-ready`;
   * - the SDK finished loading before this component mounted -> the event has
   *   already been dispatched and will never fire again, so the current state
   *   is read from `window.npgSdkReady`.
   *
   * If the integrity hash cannot be fetched or SRI validation fails, the loader
   * never signals readiness: `sdkReady` stays false and `buildSdk` stays a
   * noop, so no payment can use an unvalidated SDK.
   */
  useEffect(() => {
    const onSdkReady = () => setSdkReady(true);
    // Subscribe first, then read the flag, so a load completing in between is not lost.
    window.addEventListener(NPG_SDK_READY_EVENT, onSdkReady);
    if (window.npgSdkReady) {
      setSdkReady(true);
    }
    return () => window.removeEventListener(NPG_SDK_READY_EVENT, onSdkReady);
  }, []);

  return { sdkReady, buildSdk: sdkReady ? createBuild : noop };
};
