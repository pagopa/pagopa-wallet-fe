import React, { useEffect } from "react";
import * as O from "fp-ts/lib/Option";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/function";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";
import utils from "../utils";
import { OUTCOME_ROUTE } from "./models/routeModel";

const Esito = () => {
  const { getSessionItem, SessionItems } = utils.storage;

  useEffect(() => {
    void (async () => {
      const sessionToken = getSessionItem(SessionItems.sessionToken);
      const walletId = getSessionItem(SessionItems.walletId);
      const orderId = getSessionItem(SessionItems.orderId);
      pipe(
        sequenceS(O.option)({ sessionToken, walletId, orderId }),
        O.match(
          () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
          ({ sessionToken, walletId, orderId }) =>
            utils.api.npg.creditCard.getSessionWallet(
              sessionToken,
              walletId,
              orderId
            )
        )
      );
    })();
  }, []);

  return (
    <PageContainer>
      <WalletLoader />
    </PageContainer>
  );
};

export default Esito;
