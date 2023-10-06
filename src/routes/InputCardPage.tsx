import { Box } from "@mui/material";
// import cardValidator from "card-validator";
import React from "react";
import PageContainer from "../components/commons/PageContainer";
import { InputCardFormFields } from "../features/onboard/models";
import { InputCardForm } from "../features/onboard/components/InputCardForm";
import utils from "../utils";
import { SessionItems } from "../utils/storage";
import { WalletRequest } from "../../generated/definitions/payment-manager-v1/WalletRequest";
import { TypeEnum } from "../../generated/definitions/payment-manager-v1/Wallet";
import Verify, { Props as VerifyProps } from "../components/Verify";

export default function InputCardPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Omit<VerifyProps, "sessionToken">>();

  const sessionToken = utils.storage.load(SessionItems.sessionToken);

  const onError = (e: Error) => console.error(e.message);

  const onSubmit = async (inputCardData: InputCardFormFields) => {
    try {
      setLoading(true);
      if (!sessionToken) {
        throw new Error("Bearer token can't be empty");
      }
      const wallet: WalletRequest = {
        data: {
          creditCard: {
            holder: inputCardData.name,
            securityCode: inputCardData.cvv,
            pan: inputCardData.number,
            expireMonth: inputCardData.expirationDate.substring(0, 2),
            expireYear: inputCardData.expirationDate.substring(3)
          },
          type: TypeEnum.CREDIT_CARD
        }
      };

      const resp = await utils.api.addWallet(sessionToken, wallet);

      if (resp) {
        const { status } = resp;
        const idWallet = resp.value?.data?.idWallet;
        const { cvv } = inputCardData;

        if (status === 200 && idWallet) {
          setData({
            idWallet,
            cvv: Number(cvv)
          });
        }
      }
    } catch (e) {
      onError(e as Error);
    }
  };

  return (
    <PageContainer title="inputCardPage.title">
      <Box sx={{ mt: 4 }}>
        <InputCardForm onSubmit={onSubmit} loading={loading} />
        {data && sessionToken && (
          <Verify
            cvv={data.cvv}
            idWallet={data.idWallet}
            sessionToken={sessionToken}
          />
        )}
      </Box>
    </PageContainer>
  );
}
