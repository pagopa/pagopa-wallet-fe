import { useEffect, useState } from "react";
import createBuildConfig from "../utils/buildConfig";
import { FieldId, FieldStatus } from "../features/onboard/components/types";
import { getConfigOrThrow } from "../config";

export type SdkBuild = {
  onChange?: (field: FieldId, fieldStatus: FieldStatus) => void;
  onReadyForPayment?: () => void;
  onPaymentComplete?: () => void;
  onPaymentRedirect?: (urlRedirect: string) => void;
  onBuildError: () => void;
};

const notReady = () => {
  throw new Error(
    "sdk not ready error, wait for the sdkReady value to be true"
  );
};

const scriptReadyId = "npgReadyScript";

export const useNpgSdk = () => {
  const [sdkReady, setSdkReady] = useState(false);

  const createBuild = ({
    onChange = () => null,
    onReadyForPayment = () => null,
    onPaymentComplete = () => null,
    onPaymentRedirect = () => null,
    onBuildError
  }: SdkBuild) => {
    try {
      return new Build(
        createBuildConfig({
          onChange,
          onReadyForPayment,
          onPaymentRedirect,
          onPaymentComplete,
          onBuildError
        })
      );
    } catch (_e) {
      onBuildError();
    }
  };

  useEffect(() => {
    const npgScriptLoaded = document.getElementById(scriptReadyId);
    const npgScriptEl = npgScriptLoaded ?? document.createElement("script");

    const listener = () => {
      npgScriptEl.setAttribute("id", scriptReadyId);
      setSdkReady(true);
    };

    if (npgScriptEl.id !== scriptReadyId) {
      const npgDomainScript = getConfigOrThrow().WALLET_NPG_SDK_URL;
      npgScriptEl.setAttribute("src", npgDomainScript);
      npgScriptEl.setAttribute("type", "text/javascript");
      npgScriptEl.setAttribute("charset", "UTF-8");
      document.head.appendChild(npgScriptEl);
      npgScriptEl.addEventListener("load", listener);
    }

    return () => {
      npgScriptEl.removeEventListener("load", listener);
    };
  }, []);

  return { sdkReady, buildSdk: sdkReady ? createBuild : notReady };
};
