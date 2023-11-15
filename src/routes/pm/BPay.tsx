import { Box } from "@mui/material";
import React from "react";
import PageContainer from "../../components/commons/PageContainer";
import utils from "../../utils";
import { SessionItems } from "../../utils/storage";

export default function BPAyPage() {
  const sessionToken = utils.url.getFragmentParameter(
    window.location.href,
    SessionItems.sessionToken
  );

  void (async () => {
    await utils.api.listBpay(sessionToken);
  })();

  return (
    <PageContainer title="bPayPage.title" description="bPayPage.description">
      <Box sx={{ mt: 4 }}>BPay</Box>
    </PageContainer>
  );
}
