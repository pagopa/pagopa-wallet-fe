import React from "react";
import { useTranslation } from "react-i18next";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { getConfigOrThrow } from "../config";
import PageContainer from "../components/commons/PageContainer";
import utils from "../utils";
import { FormButtons } from "../components/FormButtons/FormButtons";
import { BundleOption } from "../../generated/definitions/webview-payment-wallet/BundleOption";
import WalletLoader from "../components/commons/WalletLoader";
import { ROUTE_FRAGMENT, OUTCOME_ROUTE } from "./models/routeModel";

const Apm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<BundleOption>([]);
  const [selectedIdPsp, setSelectedIdPsp] = React.useState<string>("");
  const redirectWithError = () =>
    utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);

  const { sessionToken, walletId, paymentMethodId } = utils.url.getFragments(
    ROUTE_FRAGMENT.SESSION_TOKEN,
    ROUTE_FRAGMENT.WALLET_ID,
    ROUTE_FRAGMENT.PAYMENT_METHOD_ID
  );

  utils.storage.setSessionItem(
    utils.storage.SessionItems.sessionToken,
    sessionToken
  );
  utils.storage.setSessionItem(utils.storage.SessionItems.walletId, walletId);

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

  const getPsps = React.useCallback(async () => {
    setLoading(true);
    pipe(
      await utils.api.npg.apm.getPspsForPaymentMethod(paymentMethodId),
      E.match(redirectWithError, setList),
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    void getPsps();
  }, []);

  return (
    <PageContainer
      title={t("paypalPage.title")}
      description={t("paypalPage.description")}
    >
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
              control={<Radio />}
              sx={styles.formControl}
              label={
                <img
                  src={pspImagePath(bundle.abi)}
                  alt="Logo gestore"
                  style={styles.pspImg}
                />
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormButtons
        type="button"
        handleCancel={redirectWithError}
        submitTitle={`${t("paypalPage.buttons.submit")}`}
        cancelTitle="paypalPage.buttons.cancel"
        disabledSubmit={loading || !selectedIdPsp}
        disabledCancel={loading}
      />
    </PageContainer>
  );
};

export default Apm;

const styles = {
  formControl: {
    ".MuiFormControlLabel-label": {
      width: "100%"
    }
  },
  pspImg: {
    display: "flex",
    maxWidth: 200,
    maxHeight: 30
  }
};
