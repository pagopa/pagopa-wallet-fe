import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";
import { getConfigOrThrow } from "../config";
import utils from "../utils";
import { useNpgSdk } from "../hooks/useNpgSdk";
import { OUTCOME_ROUTE, ROUTE_FRAGMENT } from "./models/routeModel";

//
// Returns a fetch wrapped with timeout and retry logic
//
const gdiCheckTimeout = getConfigOrThrow()
  .WALLET_GDI_CHECK_TIMEOUT as Millisecond;

const ContextualOnboardingGdiCheck = () => {
  const navigate = useNavigate();

  // Fragment Parameters
  const { sessionToken, clientId, transactionId, gdiIframeUrl } =
    utils.url.getFragments(
      ROUTE_FRAGMENT.SESSION_TOKEN,
      ROUTE_FRAGMENT.CLIENT_ID,
      ROUTE_FRAGMENT.TRANSACTION_ID,
      ROUTE_FRAGMENT.GDI_IFRAME_URL
    );

  const decodedGdiIframeUrl = Buffer.from(gdiIframeUrl, "base64").toString(
    "ascii"
  );

  // Outcome Paths
  const outcomePath = `${
    getConfigOrThrow().WALLET_CONTEXTUAL_ONBOARDING_ECOMMERCE_FE_OUTCOME_URL
  }#${ROUTE_FRAGMENT.CLIENT_ID}=${clientId}&${
    ROUTE_FRAGMENT.TRANSACTION_ID
  }=${transactionId}&${ROUTE_FRAGMENT.SESSION_TOKEN}=${sessionToken}`;
  const navigateToOutcome = () => navigate(outcomePath, { replace: true });

  // Sdk Callbacks
  const onBuildError = () =>
    utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);
  const onPaymentRedirect = (urlredirect: string) => {
    window.location.replace(urlredirect);
  };

  // Npg sdk loading
  const { buildSdk, sdkReady } = useNpgSdk({
    onPaymentComplete: navigateToOutcome,
    onBuildError,
    onPaymentRedirect
  });

  useEffect(() => {
    if (
      clientId === "IO" &&
      sdkReady &&
      decodedGdiIframeUrl &&
      transactionId &&
      sessionToken
    ) {
      buildSdk();
    }
  }, [clientId, sdkReady, decodedGdiIframeUrl, transactionId, sessionToken]);

  // Navigate to outcome on timeout
  useEffect(() => {
    const timeoutId = setTimeout(navigateToOutcome, gdiCheckTimeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <PageContainer>
      <WalletLoader />
      {decodedGdiIframeUrl && (
        <iframe src={decodedGdiIframeUrl} style={{ display: "none" }} />
      )}
    </PageContainer>
  );
};

export default ContextualOnboardingGdiCheck;
