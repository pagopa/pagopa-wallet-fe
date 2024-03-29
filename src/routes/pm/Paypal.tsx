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
  Typography
} from "@mui/material";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React from "react";
import { useTranslation } from "react-i18next";
import { PaypalPspListResponse } from "../../../generated/definitions/payment-manager-v1/PaypalPspListResponse";
import { FormButtons } from "../../components/FormButtons/FormButtons";
import Verify, { VERIFY } from "../../components/Verify";
import ErrorModal from "../../components/commons/ErrorModal";
import PageContainer from "../../components/commons/PageContainer";
import WalletLoader from "../../components/commons/WalletLoader";
import { getConfigOrThrow } from "../../config";
import utils from "../../utils";
import { ErrorsType } from "../../utils/errors/errorsModel";
import { OUTCOME_ROUTE, ROUTE_FRAGMENT } from "../models/routeModel";
import DrawerTransactionManager from "../../components/drawers/DrawerTransactionManager";
import { PayPalPsp } from "../../../generated/definitions/payment-manager-v1/PayPalPsp";
import DrawerPSP from "../../components/drawers/DrawerPSP";
import pm from "../../utils/api/pm";

export default function PaypalPage() {
  const { t } = useTranslation();
  const [cancelLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [error] = React.useState("");
  const [pspList, setPspList] = React.useState<PaypalPspListResponse>();
  const [idPsp, setIdPsp] = React.useState<string>("");
  const [submitted, setSubmitted] = React.useState(false);
  const [drawstateTM, setDrawstateTM] = React.useState(false);
  const [drawstatePSP, setDrawstatePSP] = React.useState(false);
  const [pspDrawerInfo, setPspDrawerInfo] = React.useState<
    PayPalPsp | undefined
  >(undefined);

  const toggleDrawerTM = (open: boolean) => {
    setDrawstateTM(open);
  };
  const toggleDrawerPSP = (open: boolean, paypalPsp?: PayPalPsp) => {
    setPspDrawerInfo(paypalPsp || undefined);
    setDrawstatePSP(open);
  };

  const { sessionToken } = utils.url.getFragments(ROUTE_FRAGMENT.SESSION_TOKEN);

  const pspImagePath = (abi: string | undefined): string =>
    pipe(
      abi,
      O.fromNullable,
      O.map((abi) =>
        getConfigOrThrow()
          .WALLET_PAGOPA_LOGOS_CDN.concat("/")
          .concat(abi)
          .concat(".png")
      ),
      O.getOrElse(() => "")
    );

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

  const redirectWithError = () =>
    utils.url.redirectWithOutcome(OUTCOME_ROUTE.CANCELED_BY_USER);

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
      <PageContainer
        title={t("paypalPage.title")}
        description={t("paypalPage.description")}
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
                  pspList?.data.map((psp) => (
                    <FormControlLabel
                      key={psp.idPsp}
                      value={psp.idPsp}
                      control={<Radio />}
                      sx={styles.formControl}
                      label={
                        <Stack sx={styles.radioStack}>
                          <img
                            src={pspImagePath(psp.codiceAbi)}
                            alt={`Logo gestore ${psp.ragioneSociale}`}
                            style={styles.pspImg}
                          />
                          <Button
                            aria-label={t("paypalPage.pspInfoModal.info")}
                            onClick={() => {
                              toggleDrawerPSP(true, psp);
                            }}
                          >
                            <InfoOutlinedIcon
                              sx={{ color: "primary.main", cursor: "pointer" }}
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
              type="submit"
              handleCancel={redirectWithError}
              loadingSubmit={submitted}
              loadingCancel={cancelLoading}
              submitTitle={`${t("paypalPage.buttons.submit")}`}
              cancelTitle="paypalPage.buttons.cancel"
              disabledSubmit={loading}
              disabledCancel={loading}
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
        toggleDrawer={() => toggleDrawerPSP(false)}
        pspInfo={pspDrawerInfo}
      />
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
