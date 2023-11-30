import React, { useEffect } from "react";
import * as O from "fp-ts/lib/Option";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";
import utils from "../utils";
import { OUTCOME_ROUTE } from "./models/routeModel";

const Esito = () => {
  const { getSessionItem, SessionItems } = utils.storage;

  useEffect(() => {
    void (async () => {
      const walletId = getSessionItem(SessionItems.walletId);
      const orderId = getSessionItem(SessionItems.orderId);
      pipe(
        sequenceS(O.option)({ walletId, orderId }),
        O.match(
          () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
          async ({ walletId, orderId }) =>
            pipe(
              await utils.api.npg.creditCard.getSessionWallet(
                walletId,
                orderId
              ),
              E.match(
                () =>
                  utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
                ({ outcome }) =>
                  utils.url.redirectWithOutcome(
                    outcome === undefined
                      ? OUTCOME_ROUTE.GENERIC_ERROR
                      : outcome
                  )
              )
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
