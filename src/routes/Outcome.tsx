import React, { useEffect } from "react";
import * as O from "fp-ts/lib/Option";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PageContainer from "../components/commons/PageContainer";
import utils from "../utils";
import { getConfigOrThrow } from "../config";
import { OUTCOME_ROUTE } from "./models/routeModel";

const Outcome = () => {
  const { t } = useTranslation();
  const { getSessionItem, SessionItems } = utils.storage;

  const [outcomeState, setOutcomeState] = React.useState<OUTCOME_ROUTE | null>(
    null
  );
  const config = getConfigOrThrow();

  const performRedirectToClient = (
    newOutcome?: OUTCOME_ROUTE,
    walletId?: string
  ) => {
    // if not present new outcome use old one
    const outcome = newOutcome || outcomeState || OUTCOME_ROUTE.GENERIC_ERROR;
    utils.url.redirectWithOutcome(outcome, walletId);
    // if is new outcome, update state after timeout
    if (newOutcome) {
      setTimeout(
        () => setOutcomeState(outcome),
        config.WALLET_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS
      );
    }
  };

  useEffect(() => {
    void (async () => {
      const walletId = getSessionItem(SessionItems.walletId);
      const orderId = getSessionItem(SessionItems.orderId);
      const sessionToken = getSessionItem(SessionItems.sessionToken);
      pipe(
        sequenceS(O.option)({ walletId, orderId, sessionToken }),
        O.match(
          () => performRedirectToClient(OUTCOME_ROUTE.GENERIC_ERROR),
          async ({ walletId, orderId, sessionToken }) =>
            pipe(
              await utils.api.npg.getSessionWallet(
                walletId.value,
                orderId.value,
                sessionToken.value
              ),
              E.match(
                () => performRedirectToClient(OUTCOME_ROUTE.GENERIC_ERROR),
                ({ outcome }) =>
                  performRedirectToClient(
                    utils.outcome.getOnboardingOutcome(outcome),
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
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          display: "flex",
          left: 0,
          top: 0,
          pb: 20,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress />
        {outcomeState && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "400px",
              textAlign: "center",
              p: 3,
              gap: 2
            }}
          >
            <Typography variant="h5" fontWeight={700} id="waitingTitle">
              {t("resultPage.justFewMoments")}
            </Typography>
            <Typography variant="body2" id="waitingMessage">
              {t("resultPage.completeOperationMsg")}
            </Typography>
            <Button
              sx={{
                mt: 2
              }}
              variant="outlined"
              onClick={() => performRedirectToClient()}
              id="continueToIOBtn"
            >
              {t("resultPage.continueToIO")}
            </Button>
          </Box>
        )}
      </Box>
    </PageContainer>
  );
};

export default Outcome;
