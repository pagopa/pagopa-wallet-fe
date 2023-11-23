import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import PageContainer from "../../components/commons/PageContainer";
import { InputCardFormFields } from "../../features/onboard/models";
import { InputCardForm } from "../../features/onboard/components/InputCardForm";
import utils from "../../utils";
import { WalletRequest } from "../../../generated/definitions/payment-manager-v1/WalletRequest";
import { TypeEnum } from "../../../generated/definitions/payment-manager-v1/Wallet";
import Verify, { VERIFY } from "../../components/Verify";
import { ErrorsType } from "../../utils/errors/errorsModel";
import ErrorModal from "../../components/commons/ErrorModal";

export default function InputCardPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{ idWallet: number; cvv: number }>();
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [error, setError] = React.useState<ErrorsType | "">("");

  const { t } = useTranslation();

  const sessionToken = utils.url.getFragmentParameter(
    window.location.href,
    "sessionToken"
  );

  const onError = (errroMessage: ErrorsType) => {
    setError(errroMessage);
    setErrorModalOpen(true);
    setLoading(false);
  };

  const onSuccess = (cvv: number) => (idWallet: number) => {
    setData({ idWallet, cvv });
  };

  const onSubmit = (inputCardData: InputCardFormFields) => {
    setLoading(true);
    if (!sessionToken) {
      return onError(ErrorsType.MISSING_SESSIONTOKEN);
    }
    const {
      cvv: securityCode,
      name: holder,
      number: pan,
      expirationDate
    } = inputCardData;
    const wallet: WalletRequest = {
      data: {
        creditCard: {
          holder,
          securityCode,
          pan,
          expireMonth: expirationDate.substring(0, 2),
          expireYear: expirationDate.substring(3)
        },
        type: TypeEnum.CREDIT_CARD
      }
    };
    void utils.api.creditCard.addWallet(
      sessionToken,
      wallet,
      onSuccess(Number(securityCode)),
      onError
    );
  };

  return (
    <PageContainer title={t("inputCardPage.title")}>
      <Box sx={{ mt: 4 }}>
        <InputCardForm onSubmit={onSubmit} loading={loading} />
        {data && sessionToken && (
          <Verify
            cvv={data.cvv}
            idWallet={data.idWallet}
            sessionToken={sessionToken}
            path={VERIFY.CARDS}
          />
        )}
      </Box>
      {!!error && (
        <ErrorModal
          error={error}
          open={errorModalOpen}
          onClose={() => {
            setErrorModalOpen(false);
          }}
          titleId="inputCardPageErrorTitleId"
          errorId="inputCardPageErrorId"
          bodyId="inputCardPageErrorBodyId"
        />
      )}
    </PageContainer>
  );
}
