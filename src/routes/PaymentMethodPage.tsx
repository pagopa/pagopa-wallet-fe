import { Divider, Typography, Box, Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PageContainer from "../components/commons/PageContainer";
import apiClient from "../utils/api/client";
import { getFragmentParameter } from "../utils/urlUtilities";
import { PaymentMethodsResponse } from "../../generated/definitions/webview-payment-wallet/PaymentMethodsResponse";
import {
  PaymentMethodRoutes,
  TransactionMethods
} from "./models/paymentMethodRoutes";

interface MethodElement {
  title: string;
  description?: string;
  icon?: string;
  link?: string;
  paymentTypeCode: string;
}

const Method = (props: MethodElement) => {
  const { paymentTypeCode } = props;
  const { route, asset: Asset } =
    PaymentMethodRoutes[paymentTypeCode as TransactionMethods];
  const Icon = Asset ? <Asset sx={{ fontSize: 24 }} /> : null;
  return (
    <Link href={route} underline="none">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {Icon}
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
};

export default function PaymentMethodPage() {
  const [methods, setMethods] = useState<
    PaymentMethodsResponse["paymentMethods"]
  >([]);

  const bearerAuth = getFragmentParameter(window.location.href, "sessionToken");

  useEffect(() => {
    void apiClient.getAllPaymentMethods(bearerAuth, () => null, setMethods);
  }, []);

  return (
    <PageContainer
      title="paymentMethodPage.title"
      description="paymentMethodPage.description"
    >
      <Stack divider={<Divider />} gap="12px" pt="12px" mt={3}>
        {methods?.map((method, i) => (
          <Method
            paymentTypeCode={method.paymentTypeCode}
            title={method.description}
            key={`${method.description}-${i}`}
          />
        ))}
      </Stack>
    </PageContainer>
  );
}
