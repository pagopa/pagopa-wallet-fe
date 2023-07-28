import { Divider, Typography, Box, Link } from "@mui/material";
import React from "react";
import Stack from "@mui/material/Stack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCardIcon from "@mui/icons-material/AddCard";
import PageContainer from "../components/commons/PageContainer";

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
