import { Divider, Typography, Box, Link } from "@mui/material";
import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCardIcon from "@mui/icons-material/AddCard";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import PageContainer from "../components/commons/PageContainer";
import { apiPaymentEcommerceClient } from "../utils/api/client";

interface MethodElement {
  title: string;
  description: string;
  icon: string;
}

const mockMethods: Array<MethodElement> = [
  {
    title: "Carta di debito, credito o prepagata",
    description: "La carta che usi online e nei negozi",
    icon: "card"
  },
  {
    title: "BANCOMAT PAY",
    description: "Paga con carta o conti collegati",
    icon: "Bancomat-pay"
  },
  {
    title: "PayPal",
    description: "Paga con carta o conti collegati",
    icon: "paypal"
  }
];

const Method = (props: MethodElement) => (
  <Link href="/onboard/inserisci-carta" underline="none">
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <AddCardIcon color="primary" sx={{ fontSize: 24 }} />
      <Box sx={{ width: "70%" }}>
        <Typography
          variant="h5"
          lineHeight="24px"
          fontSize={16}
          fontWeight={400}
          color="text.primary"
        >
          {props.title}
        </Typography>
        <Typography
          lineHeight="21px"
          variant="body2"
          fontSize={14}
          fontWeight={400}
          color="text.secondary"
        >
          {props.description}
        </Typography>
      </Box>
      <ArrowForwardIosIcon color="primary" sx={{ fontSize: 14 }} />
    </Stack>
  </Link>
);

export default function PaymentMethodPage() {
  const [paymentMethodPage, setPaymentMethodPage] = useState([]);

  useEffect(() => {
    void (async () => {
      const list = await pipe(
        TE.tryCatch(
          () =>
            apiPaymentEcommerceClient.getAllPaymentMethods({
              bearerAuth:
                "4c1M9s7d4P5x9m6D8s0f3O5z2h9E9q2q7S7p8k5O1t5h7B6h4a2N8v7i9B9u4f6M1e1f0L3j3y4E5q4p6H9e9i9J5n1h3K1p1o0G8u1h9J8h9c1P5j1c5Y4s9c3T2q5u"
            }),
          console.error
        )
      )();
      console.log(list);
    })();
  }, []);

  return (
    <PageContainer
      title="paymentMethodPage.title"
      description="paymentMethodPage.description"
    >
      <Stack divider={<Divider />} gap="12px" pt="12px" mt={3}>
        {mockMethods.map((mockElement, i) => (
          <Method {...mockElement} key={`${mockElement.description}-${i}`} />
        ))}
      </Stack>
    </PageContainer>
  );
}
