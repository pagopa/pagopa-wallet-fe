/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable sonarjs/cognitive-complexity */
import { Box, Button, Link } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CancelPayment } from "../components/modals/CancelPayment";
import ErrorModal from "../components/modals/ErrorModal";
import CheckoutLoader from "../components/PageContent/CheckoutLoader";
import PageContainer from "../components/PageContent/PageContainer";
import { PaymentChoice } from "../features/payment/components/PaymentChoice/PaymentChoice";
import {
  Cart,
  PaymentInfo,
  PaymentInstruments,
} from "../features/payment/models/paymentModel";
import { getPaymentInstruments } from "../utils/api/helper";
import { getTotalFromCart } from "../utils/cart/cart";
import { getSessionItem, SessionItems } from "../utils/storage/sessionStorage";
import { CheckoutRoutes } from "./models/routeModel";

export default function PaymentChoicePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cart = getSessionItem(SessionItems.cart) as Cart | undefined;
  const amount =
    (getSessionItem(SessionItems.paymentInfo) as PaymentInfo | undefined)
      ?.amount ||
    (cart && getTotalFromCart(cart)) ||
    0;
  const [loading, setLoading] = React.useState(false);
  const [instrumentsLoading, setInstrumentsLoading] = React.useState(false);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [paymentInstruments, setPaymentInstruments] = React.useState<
    Array<PaymentInstruments>
  >([]);

  const getPaymentMethods = React.useCallback(() => {
    setInstrumentsLoading(true);
    void getPaymentInstruments({ amount }, onError, onResponse);
  }, []);

  React.useEffect(getPaymentMethods, []);

  const onResponse = React.useCallback((list: Array<PaymentInstruments>) => {
    setPaymentInstruments(list);
    setInstrumentsLoading(false);
  }, []);

  const onError = React.useCallback((m: string) => {
    setLoading(false);
    setError(m);
    setErrorModalOpen(true);
  }, []);

  const onCancelResponse = React.useCallback(() => {
    setLoading(false);
    navigate(`/${CheckoutRoutes.ANNULLATO}`);
  }, []);

  const onCancelPaymentSubmit = React.useCallback(() => {
    setCancelModalOpen(false);
    setLoading(true);
    onCancelResponse();
  }, []);

  const handleBackNavigate = React.useCallback(() => navigate(-1), []);
  const handleCloseModal = React.useCallback(
    () => setCancelModalOpen(false),
    []
  );
  const handleCloseErrorModal = React.useCallback(
    () => setErrorModalOpen(false),
    []
  );
  const handleRetry = React.useCallback(getPaymentMethods, []);

  return (
    <>
      {loading && <CheckoutLoader />}
      <PageContainer
        title="paymentChoicePage.title"
        description="paymentChoicePage.description"
        link={
          <Link
            href={`https://www.pagopa.gov.it/it/cittadini/trasparenza-costi/?amount=${amount}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600, textDecoration: "none" }}
            title={t("paymentChoicePage.costs")}
          >
            {t("paymentChoicePage.costs")}
          </Link>
        }
      >
        <Box sx={{ mt: 6 }}>
          <PaymentChoice
            amount={amount}
            paymentInstruments={paymentInstruments}
            loading={instrumentsLoading}
          />
          <Box py={4} sx={{ width: "100%", height: "100%" }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleBackNavigate}
              style={{
                minWidth: "120px",
                height: "100%",
                minHeight: 45,
              }}
              disabled={instrumentsLoading}
            >
              {t("paymentChoicePage.button")}
            </Button>
          </Box>
        </Box>
        <CancelPayment
          open={cancelModalOpen}
          onCancel={handleCloseModal}
          onSubmit={onCancelPaymentSubmit}
        />
        {!!error && (
          <ErrorModal
            error={error}
            open={errorModalOpen}
            onClose={handleCloseErrorModal}
            onRetry={handleRetry}
          />
        )}
      </PageContainer>
    </>
  );
}
