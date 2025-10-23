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
    const npgScriptEl = document.createElement("script");
    const npgDomainScript = getConfigOrThrow().WALLET_NPG_SDK_URL;
    npgScriptEl.setAttribute("src", npgDomainScript);
    npgScriptEl.setAttribute("type", "text/javascript");
    npgScriptEl.setAttribute("charset", "UTF-8");
    document.head.appendChild(npgScriptEl);
    npgScriptEl.addEventListener("load", () => setSdkReady(true));
  }, []);

  return { sdkReady, buildSdk: sdkReady ? createBuild : noop };
};
