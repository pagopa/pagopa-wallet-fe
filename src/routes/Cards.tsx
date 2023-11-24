import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import PageContainer from "../components/commons/PageContainer";
import IframeCardForm from "../features/onboard/components/IframeCardForm";

export default function IFrameCardPage() {
  // const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  // const [error, setError] = React.useState("");
  // Is It allowed to store the bin temporary?
  // const [bin, setBin] = React.useState("");

  const { t } = useTranslation();

  return (
    <PageContainer title={t("inputCardPage.title")}>
      <Box sx={{ mt: 6 }}>
        <IframeCardForm />
      </Box>
    </PageContainer>
  );
}
