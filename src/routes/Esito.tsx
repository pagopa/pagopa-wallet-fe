import React, { useEffect } from "react";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";
import utils from "../utils";
import { ROUTE_FRAGMENT } from "./models/routeModel";

const Esito = () => {
  const token = sessionStorage.getItem(ROUTE_FRAGMENT.SESSION_TOKEN);

  useEffect(() => {
    void (async () => {
      const status = await utils.api.npg.creditCard.getSessionWallet(
        token || "",
        "test"
      );
      console.log("status", status);
    })();
  }, []);

  return (
    <PageContainer>
      <WalletLoader />
    </PageContainer>
  );
};

export default Esito;
