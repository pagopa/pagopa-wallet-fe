import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import PageContainer from "../components/commons/PageContainer";
import IframeCardForm from "../features/onboard/components/IframeCardForm";

interface IFrameCardPageProps {
  isPayment?: boolean;
}

export default function IFrameCardPage(props: IFrameCardPageProps) {
  const { isPayment } = props;
  const { t } = useTranslation();

  return (
    <PageContainer title={t("inputCardPage.title")}>
      <Box sx={{ mt: 6 }}>
        <IframeCardForm isPayment={isPayment} />
      </Box>
    </PageContainer>
  );
}
