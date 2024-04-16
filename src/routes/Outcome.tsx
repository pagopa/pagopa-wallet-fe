import React, { useEffect } from "react";
import * as O from "fp-ts/lib/Option";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";
import utils from "../utils";
import { OUTCOME_ROUTE } from "./models/routeModel";

const Outcome = () => {
  const { getSessionItem, SessionItems } = utils.storage;

  useEffect(() => {
    void (async () => {
      const walletId = getSessionItem(SessionItems.walletId);
      const orderId = getSessionItem(SessionItems.orderId);
      const sessionToken = getSessionItem(SessionItems.sessionToken);
      pipe(
        sequenceS(O.option)({ walletId, orderId, sessionToken }),
        O.match(
          () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
          async ({ walletId, orderId, sessionToken }) =>
            pipe(
              await utils.api.npg.getSessionWallet(
                walletId.value,
                orderId.value,
                sessionToken.value
              ),
              E.match(
                () =>
                  utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
                ({ outcome }) =>
                  utils.url.redirectWithOutcome(
                    outcome === undefined
                      ? OUTCOME_ROUTE.GENERIC_ERROR
                      : outcome,
                    outcome === 0 ? walletId?.value : undefined
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

export default Outcome;
