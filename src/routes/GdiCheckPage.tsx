import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";
import { getConfigOrThrow } from "../config";
import utils from "../utils";
import { OUTCOME_ROUTE } from "./models/routeModel";

const GdiCheckPage = () => {
  const {
    state: { gdiIframeUrl }
  } = useLocation();

  const outcomeErrorRedirect = () =>
    utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);

  const gdiCheckTimeout = getConfigOrThrow().WALLET_GDI_CHECK_TIMEOUT;

  const decodedGdiIframeUrl = Buffer.from(gdiIframeUrl, "base64").toString(
    "ascii"
  );

  useEffect(() => {
    const timeoutId = setTimeout(outcomeErrorRedirect, gdiCheckTimeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <PageContainer>
      <WalletLoader />
      <iframe src={decodedGdiIframeUrl} style={{ display: "none" }} />
    </PageContainer>
  );
};
export default GdiCheckPage;
