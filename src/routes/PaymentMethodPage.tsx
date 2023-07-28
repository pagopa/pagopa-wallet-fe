import { Box } from "@mui/material";
import React from "react";
import PageContainer from "../components/commons/PageContainer";

export default function PaymentMethodPage() {
  return (
    <PageContainer
      title="paymentMethodPage.title"
      description="paymentMethodPage.description"
    >
      <Box sx={{ mt: 6 }}>Scegli il metodo</Box>
    </PageContainer>
  );
}
