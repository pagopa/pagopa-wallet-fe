import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import PageContainer from "../components/commons/PageContainer";
import IframeCardForm from "../features/onboard/components/IframeCardForm";
import InformationModal from "../components/commons/InformationModal";

interface IFrameCardPageProps {
  isPayment?: boolean;
}

export default function IFrameCardPage(props: IFrameCardPageProps) {
  const { isPayment } = props;
  const { t } = useTranslation();
  const [cvvModalOpen, setCvvModalOpen] = React.useState(false);
  const handleClose = () => setCvvModalOpen(false);

  return (
    <PageContainer title={t("inputCardPage.title")}>
      <Button
        data-testid="helpLink"
        id={"helpLink"}
        variant="text"
        onClick={() => setCvvModalOpen(true)}
        sx={{ p: 0 }}
      >
        {t("iframeCardPage.helpLink")}
      </Button>
      <Box sx={{ mt: 6 }}>
        <IframeCardForm isPayment={isPayment} />
      </Box>
      <InformationModal
        open={cvvModalOpen}
        onClose={handleClose}
        maxWidth="sm"
        hideIcon={true}
      >
        <Typography
          data-testid="modalTitle"
          variant="h6"
          component={"div"}
          sx={{ pb: 2 }}
        >
          {t("iframeCardPage.modalTitle")}
        </Typography>
        <Box sx={{ mt: -1 }}>
          <Typography
            variant="body1"
            component={"div"}
            sx={{
              "& ul": {
                listStyleType: "none",
                paddingLeft: 0,
                marginTop: 2,
                marginBottom: 0
              },
              "& li": {
                display: "flex",
                marginBottom: 1
              },
              "& li.second": {
                marginTop: 0
              },
              "& li .bullet": {
                minWidth: "24px"
              },
              "& p:first-of-type": {
                marginTop: 0
              }
            }}
          >
            <Trans i18nKey="iframeCardPage.modalBodyText">
              Default text <br /> Fallback
            </Trans>
          </Typography>
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              data-testid="closeButton"
              variant="contained"
              onClick={handleClose}
            >
              {t("iframeCardPage.buttonClose")}
            </Button>
          </Box>
        </Box>
      </InformationModal>
    </PageContainer>
  );
}
