import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import PageContainer from "../components/commons/PageContainer";
import IframeCardForm from "../features/onboard/components/IframeCardForm";
import InformationModal, {
  InformationModalRef
} from "../components/commons/InformationModal";

interface IFrameCardPageProps {
  isPayment?: boolean;
}

export default function IFrameCardPage(props: IFrameCardPageProps) {
  const { isPayment } = props;
  const { t } = useTranslation();
  const cvvModalRef = React.useRef<InformationModalRef>(null);

  return (
    <PageContainer title={t("inputCardPage.title")}>
      <Button
        data-testid="helpLink"
        variant="text"
        onClick={() => cvvModalRef.current?.openDialog()}
        sx={{ p: 0 }}
      >
        {t("iframeCardPage.helpLink")}
      </Button>

      <Box sx={{ mt: 6 }}>
        <IframeCardForm isPayment={isPayment} />
      </Box>

      <InformationModal ref={cvvModalRef} maxWidth="sm" hideIcon>
        <Typography variant="h6" sx={{ pb: 2 }}>
          {t("iframeCardPage.modalTitle")}
        </Typography>

        <Box sx={{ mt: -1 }}>
          <Typography variant="body1">
            <Trans i18nKey="iframeCardPage.modalBodyText">
              Default text <br /> Fallback
            </Trans>
          </Typography>

          <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              data-testid="closeButton"
              variant="contained"
              onClick={() => cvvModalRef.current?.closeDialog()}
            >
              {t("iframeCardPage.buttonClose")}
            </Button>
          </Box>
        </Box>
      </InformationModal>
    </PageContainer>
  );
}
