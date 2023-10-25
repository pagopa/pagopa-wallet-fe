import React from "react";
import { getFragmentParameter } from "../utils/urlUtilities";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";

const GdiCheckPage = () => {
  const gdiIframeUrl = getFragmentParameter(
    window.location.href,
    "gdiIframeUrl"
  );

  return (
    <PageContainer>
      <WalletLoader />
      <iframe src={gdiIframeUrl} style={{ display: "none" }} />
    </PageContainer>
  );
};
export default GdiCheckPage;
