import React from "react";
import { useLocation } from "react-router-dom";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";

const GdiCheckPage = () => {
  const {
    state: { gdiIframeUrl }
  } = useLocation();

  const decodedGdiIframeUrl = Buffer.from(gdiIframeUrl, "base64").toString(
    "ascii"
  );

  return (
    <PageContainer>
      <WalletLoader />
      <iframe src={decodedGdiIframeUrl} style={{ display: "none" }} />
    </PageContainer>
  );
};
export default GdiCheckPage;
