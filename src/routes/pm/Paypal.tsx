import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import React from "react";
import { useTranslation } from "react-i18next";
import { PaypalPspListResponse } from "../../../generated/definitions/payment-manager-v1/PaypalPspListResponse";
import { FormButtons } from "../../components/FormButtons/FormButtons";
import Verify, { VERIFY } from "../../components/Verify";
import ErrorModal from "../../components/commons/ErrorModal";
import PageContainer from "../../components/commons/PageContainer";
import WalletLoader from "../../components/commons/WalletLoader";
import utils from "../../utils";
import { ErrorsType } from "../../utils/errors/errorsModel";
import { ROUTE_FRAGMENT } from "../models/routeModel";
import DrawerTransactionManager from "../../components/drawers/DrawerTransactionManager";
import { PayPalPsp } from "../../../generated/definitions/payment-manager-v1/PayPalPsp";
import DrawerPSP from "../../components/drawers/DrawerPSP";
import pm from "../../utils/api/pm";
import paypalLogo from "../../assets/icons/paypal.svg";

export default function PaypalPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [error] = React.useState("");
  const [pspList, setPspList] = React.useState<PaypalPspListResponse>();
  const [idPsp, setIdPsp] = React.useState<string>("");
  const [showPreamble, setShowPreamble] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [drawstateTM, setDrawstateTM] = React.useState(false);
  const [drawstatePSP, setDrawstatePSP] = React.useState(false);
  const [pspDrawerInfoName, setPspDrawerInfoName] = React.useState<string>("");
  const [pspDrawerInfoFee, setPspDrawerInfoFee] = React.useState<number>(0);

  const theme = useTheme();

  const toggleDrawerTM = (open: boolean) => {
    setDrawstateTM(open);
  };
  const toggleDrawerPSP = (
    open: boolean,
    paypalPspName: string,
    paypalPspFee: number
  ) => {
    setPspDrawerInfoName(paypalPspName);
    setPspDrawerInfoFee(paypalPspFee);
    setDrawstatePSP(open);
  };

  const { sessionToken } = utils.url.getFragments(ROUTE_FRAGMENT.SESSION_TOKEN);

  const onSuccess = (response: PaypalPspListResponse) => {
    setLoading(false);
    setIdPsp(response.data[0].idPsp);
    setPspList(response);
  };

  const getPsps = React.useCallback(async () => {
    setLoading(true);
    pipe(
      await pm.paypal.getPaypalPsps(sessionToken),
      E.match(onError, onSuccess)
    );
  }, []);

  React.useEffect(() => {
    void getPsps();
  }, []);

  const onError = React.useCallback(() => {
    setLoading(false);
    setErrorModalOpen(true);
  }, []);

  const handleCloseErrorModal = React.useCallback(
    () => setErrorModalOpen(false),
    []
  );

  const handleRetry = React.useCallback(getPsps, []);

  const handleChangeSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIdPsp((event.target as HTMLInputElement).value);
  };

  return (
    <>
      {loading && <WalletLoader />}
      {idPsp && sessionToken && submitted && (
        <Verify {...{ sessionToken, idPsp, path: VERIFY.PAYPAL }} />
      )}
      {showPreamble && (
        <>
          <Box
            display="flex"
            p={1}
            justifyContent="center"
            height="100vh"
            flexDirection="column"
            alignItems="center"
            component="section"
          >
            <img src={paypalLogo} alt="Paypal Logo" aria-hidden="true" />
            <Typography
              variant="h5"
              display="block"
              textAlign="center"
              fontWeight={"700"}
              my={2}
              component="h2"
            >
              {t("paypalPage.preamble.title")}
            </Typography>
            <Typography
              variant="body2"
              display="block"
              textAlign="center"
              color={theme.palette.text.secondary}
            >
              {t("paypalPage.preamble.body")}
            </Typography>
            <Box my={2} width={"100%"}>
              <Button
                variant="contained"
                onClick={() => setShowPreamble(false)}
                style={{ width: "100%" }}
                id="preambleButton"
              >
                {t("paypalPage.preamble.cta")}
              </Button>
            </Box>
          </Box>
        </>
      )}
      {!showPreamble && (
        <>
          <PageContainer
            title={t("paypalPage.title")}
            link={
              <Link
                href={`#`}
                onClick={() => toggleDrawerTM(true)}
                style={{ fontWeight: 600, textDecoration: "none" }}
                title={t("paypalPage.helpLink")}
              >
                {t("paypalPage.helpLink")}
              </Link>
            }
          >
            <Box
              sx={{
                py: 1,
                mb: 2
              }}
            >
              <Box sx={styles.defaultStyle}>
                <Typography>{t("paypalPage.psp.header.name")}</Typography>
                <Typography>{t("paypalPage.psp.header.info")}</Typography>
              </Box>
              <form onSubmit={() => setSubmitted(true)}>
                <FormControl sx={{ width: "100%" }}>
                  <RadioGroup onChange={handleChangeSelection} value={idPsp}>
                    {idPsp &&
                      pspList?.data.map((psp: PayPalPsp) => (
                        <FormControlLabel
                          key={psp.idPsp}
                          value={psp.idPsp}
                          control={<Radio />}
                          sx={styles.formControl}
                          label={
                            <Stack sx={styles.radioStack}>
                              <Typography fontWeight="600">
                                {psp.ragioneSociale}
                              </Typography>
                              <Button
                                aria-label={t("paypalPage.pspInfoModal.info")}
                                sx={styles.formControlInfo}
                                onClick={() => {
                                  toggleDrawerPSP(
                                    true,
                                    psp.ragioneSociale,
                                    psp.avgFee
                                  );
                                }}
                              >
                                <InfoOutlinedIcon
                                  sx={{
                                    color: "primary.main",
                                    cursor: "pointer"
                                  }}
                                  fontSize="medium"
                                  titleAccess={t(
                                    "paypalPage.pspInfoModal.info"
                                  )}
                                />
                              </Button>
                            </Stack>
                          }
                        />
                      ))}
                  </RadioGroup>
                </FormControl>
                <FormButtons
                  type="submit"
                  loadingSubmit={submitted}
                  submitTitle={`${t("paypalPage.buttons.submit")}`}
                  disabledSubmit={loading}
                  disabledCancel={true}
                />
              </form>
            </Box>
            {!!error && (
              <ErrorModal
                error={ErrorsType.GENERIC_ERROR}
                open={errorModalOpen}
                onClose={handleCloseErrorModal}
                onRetry={handleRetry}
              />
            )}
          </PageContainer>
          <DrawerTransactionManager
            drawstate={drawstateTM}
            toggleDrawer={() => toggleDrawerTM(false)}
          />
          <DrawerPSP
            drawstate={drawstatePSP}
            toggleDrawer={() => toggleDrawerPSP(false, "", 0)}
            pspName={pspDrawerInfoName}
            pspFee={pspDrawerInfoFee}
          />
        </>
      )}
    </>
  );
}

const styles = {
  defaultStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    pt: 3,
    pb: 2
  },
  formControl: {
    ".MuiFormControlLabel-label": {
      width: "100%"
    }
  },
  formControlInfo: {
    width: "1.5rem"
  },
  radioStack: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    ml: 2
  },
  pspImg: {
    display: "flex",
    maxWidth: 200,
    maxHeight: 30
  }
};
