import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
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
import { PaypalPspListResponse } from "../../generated/definitions/payment-manager-v1/PaypalPspListResponse";
import { FormButtons } from "../components/FormButtons/FormButtons";
import Verify, { VERIFY } from "../components/Verify";
import ErrorModal from "../components/commons/ErrorModal";
import PageContainer from "../components/commons/PageContainer";
import WalletLoader from "../components/commons/WalletLoader";
import { getConfigOrThrow } from "../config";
import utils from "../utils";
import pm from "../utils/api/pm";
import { ErrorsType } from "../utils/errors/errorsModel";
import { OUTCOME_ROUTE, ROUTE_FRAGMENT } from "./models/routeModel";

export default function PaypalPage() {
  const { t } = useTranslation();
  const [cancelLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [error] = React.useState("");
  const [pspList, setPspList] = React.useState<PaypalPspListResponse>();
  const [idPsp, setIdPsp] = React.useState<string>("");
  const [submitted, setSubmitted] = React.useState(false);

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
    utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);

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
        title="paypalPage.title"
        description="paypalPage.description"
        link={
          <Link
            href={``}
            target="_blank"
            rel="noopener noreferrer"
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
                            alt="Logo gestore"
                            style={styles.pspImg}
                          />
                          <InfoOutlinedIcon
                            sx={{ color: "primary.main", cursor: "pointer" }}
                            fontSize="medium"
                            aria-hidden="true"
                          />
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
