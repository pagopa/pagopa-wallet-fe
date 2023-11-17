import React, { useEffect, useRef } from "react";
import { getConfigOrThrow } from "../config";

const { WALLET_CONFIG_WEBVIEW_PM_HOST } = getConfigOrThrow();
const webview = `${WALLET_CONFIG_WEBVIEW_PM_HOST}/pp-restapi-CD/v3/webview`;

export const verifyPaths = {
  cards: `${webview}/transactions/cc/verify`,
  paypal: `${webview}/paypal/onboarding/psp`
};

export enum VERIFY {
  CARDS = "cards",
  PAYPAL = "paypal"
}

export interface Props {
  path: VERIFY;
  idWallet?: number;
  cvv?: number;
  sessionToken?: string;
  idPsp?: string;
}

const Verify = ({ cvv, idWallet, sessionToken, idPsp, path }: Props) => {
  const formElement = useRef<HTMLFormElement | null>(null);

  useEffect(() => formElement.current?.submit(), []);

  return (
    <form
      action={verifyPaths[path]}
      method="POST"
      ref={formElement}
      style={{ display: "none" }}
    >
      {cvv && (
        <input type="number" name="securityCode" value={cvv} readOnly hidden />
      )}
      {idPsp && (
        <input type="text" name="sessionToken" value={idPsp} readOnly hidden />
      )}
      {idWallet && (
        <input type="number" name="idWallet" value={idWallet} readOnly hidden />
      )}
      {sessionToken && (
        <input
          type="text"
          name="sessionToken"
          value={sessionToken}
          readOnly
          hidden
        />
      )}
      <input type="text" name="language" value="IT" readOnly hidden />
      <input type="text" name="Request-Id" value="SDFY5EPC" readOnly hidden />
    </form>
  );
};

export default Verify;
