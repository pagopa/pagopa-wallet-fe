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

export default function InputCardPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>();

  const onError = (e: Error) => console.error(e.message);

  const onSubmit = async (inputCardData: InputCardFormFields) => {
    try {
      setLoading(true);
      const Bearer = utils.storage.load(SessionItems.sessionToken);
      if (!Bearer) {
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
      const data = await utils.api.addWallet(Bearer, wallet);
      if (data && data.status === 200) {
        setData(data);
      }
    } catch (e) {
      onError(e as Error);
    }
  };

  return (
    <PageContainer title="inputCardPage.title">
      <Box sx={{ mt: 4 }}>
        <InputCardForm onSubmit={onSubmit} loading={loading} />
        {JSON.stringify(data || {})}
      </Box>
    </PageContainer>
  );
}
