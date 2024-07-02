import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import React from "react";
import { useTranslation } from "react-i18next";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
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
import PageContainer from "../components/commons/PageContainer";
import utils from "../utils";
import { FormButtons } from "../components/FormButtons/FormButtons";
import { BundleOption } from "../../generated/definitions/webview-payment-wallet/BundleOption";
import WalletLoader from "../components/commons/WalletLoader";
import { SessionWalletCreateResponseData2 } from "../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponseData";
import { SessionInputDataTypePaypalEnum } from "../../generated/definitions/webview-payment-wallet/SessionInputDataTypePaypal";
import paypalLogo from "../assets/icons/paypal.svg";
import DrawerTransactionManager from "../components/drawers/DrawerTransactionManager";
import DrawerPSP from "../components/drawers/DrawerPSP";
import { ROUTE_FRAGMENT, OUTCOME_ROUTE } from "./models/routeModel";

const Apm = () => {
  const { t } = useTranslation();
  const [drawstateTM, setDrawstateTM] = React.useState(false);
  const [drawstatePSP, setDrawstatePSP] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const [list, setList] = React.useState<BundleOption>([]);
  const [selectedIdPsp, setSelectedIdPsp] = React.useState<string>("");
  const [showPreamble, setShowPreamble] = React.useState(true);
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

  const redirectWithError = () =>
    utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);

  const { sessionToken, walletId } = utils.url.getFragments(
    ROUTE_FRAGMENT.SESSION_TOKEN,
    ROUTE_FRAGMENT.WALLET_ID,
    ROUTE_FRAGMENT.PAYMENT_METHOD_ID
  );

  utils.storage.setSessionItem(
    utils.storage.SessionItems.sessionToken,
    sessionToken
  );
  utils.storage.setSessionItem(utils.storage.SessionItems.walletId, walletId);

  const getPsps = React.useCallback(async () => {
    setLoading(true);
    pipe(
      await utils.api.npg.getPspsForWallet(walletId, sessionToken),
      E.match(redirectWithError, setList),
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    void getPsps();
  }, []);

  /**
   *  return a redirect url when the method is of type apm
   */
  const onSubmit = async () => {
    setLoadingSubmit(true);
    pipe(
      await utils.api.npg.createSessionWallet(sessionToken, walletId, {
        paymentMethodType: SessionInputDataTypePaypalEnum.paypal,
        pspId: selectedIdPsp
      }),
      E.match(redirectWithError, (response) => {
        const sessionData =
          response.sessionData as SessionWalletCreateResponseData2;
        utils.storage.setSessionItem(
          utils.storage.SessionItems.orderId,
          response.orderId
        );
        pipe(
          O.fromNullable(sessionData.redirectUrl),
          O.map((url) => window.location.replace(url)),
          O.getOrElse(redirectWithError)
        );
      })
    );
  };

  return (
    <>
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
            description={t("paypalPage.description")}
            link={
              <Link
                href={`#`}
                onClick={() => toggleDrawerTM(true)}
                fontWeight={"600"}
                display="flex"
                style={{ textDecoration: "none" }}
                title={t("paypalPage.helpLink")}
              >
                {t("paypalPage.helpLink")}
              </Link>
            }
          >
            <Box sx={styles.defaultStyle}>
              <Typography variant="body2">
                {t("paypalPage.psp.header.name")}
              </Typography>
              <Typography variant="body2">
                {t("paypalPage.psp.header.info")}
              </Typography>
            </Box>
            <FormControl sx={{ width: "100%" }}>
              {loading && <WalletLoader />}
              <RadioGroup
                onChange={(_, value) => setSelectedIdPsp(value)}
                value={selectedIdPsp}
              >
                {list.bundleOptions?.map((bundle) => (
                  <FormControlLabel
                    key={bundle.idPsp}
                    value={bundle.idPsp}
                    control={<Radio id={bundle.idPsp} />}
                    disabled={loadingSubmit}
                    sx={styles.formControl}
                    label={
                      <Stack sx={styles.radioStack}>
                        <Typography fontWeight="600">
                          {bundle.pspBusinessName}
                        </Typography>
                        <Button
                          aria-label={t("paypalPage.pspInfoModal.info")}
                          onClick={() => {
                            toggleDrawerPSP(
                              true,
                              bundle.pspBusinessName || "",
                              bundle.taxPayerFee || 0
                            );
                          }}
                          sx={styles.formControlInfo}
                        >
                          <InfoOutlinedIcon
                            sx={{
                              color: "primary.main",
                              cursor: "pointer"
                            }}
                            fontSize="medium"
                            titleAccess={t("paypalPage.pspInfoModal.info")}
                          />
                        </Button>
                      </Stack>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormButtons
              type="button"
              submitTitle={`${t("paypalPage.buttons.submit")}`}
              disabledSubmit={loading || !selectedIdPsp}
              disabledCancel={true}
              loadingSubmit={loadingSubmit}
              handleSubmit={onSubmit}
            />
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
};

export default Apm;

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
