import React, { useEffect, useRef } from "react";
import { getConfigOrThrow } from "../config";

const url =
  getConfigOrThrow().WALLET_CONFIG_WEBVIEW_PM_HOST +
  "/pp-restapi-CD/v3/webview/transactions/cc/verify";

export interface Props {
  idWallet: number;
  cvv: number;
  sessionToken: string;
}

const Verify = (props: Props) => {
  const formElement = useRef<HTMLFormElement | null>(null);

  useEffect(() => formElement.current?.submit(), []);

  return (
    <form
      action={url}
      method="POST"
      ref={formElement}
      style={{ display: "none" }}
    >
      <input
        type="number"
        name="idWallet"
        value={props.idWallet}
        readOnly
        hidden
      />
      <input
        type="number"
        name="securityCode"
        value={props.cvv}
        readOnly
        hidden
      />
      <input
        type="text"
        name="sessionToken"
        value={props.sessionToken}
        readOnly
        hidden
      />
      <input type="text" name="language" value="IT" readOnly hidden />
      <input type="text" name="Request-Id" value="SDFY5EPC" readOnly hidden />
    </form>
  );
};

export default Verify;
