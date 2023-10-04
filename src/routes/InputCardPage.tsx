import { Box } from "@mui/material";
// import cardValidator from "card-validator";
import React from "react";
import PageContainer from "../components/commons/PageContainer";
import { InputCardFormFields } from "../features/onboard/models";
import { InputCardForm } from "../features/onboard/components/InputCardForm";

export default function InputCardPage() {
  const [loading, setLoading] = React.useState(false);
  const [, setWallet] = React.useState<InputCardFormFields>();

  const onSubmit = async (wallet: InputCardFormFields) => {
    setLoading(true);
    // const cardData = {
    //   brand: cardValidator.number(wallet.number).card?.type || "",
    //   expDate: wallet.expirationDate,
    //   cardHolderName: wallet.name,
    //   cvv: wallet.cvv,
    //   pan: wallet.number
    // };
    setWallet(wallet);
  };

  return (
    <PageContainer title="inputCardPage.title">
      <Box sx={{ mt: 4 }}>
        <InputCardForm onSubmit={onSubmit} loading={loading} />
      </Box>
    </PageContainer>
  );
}
