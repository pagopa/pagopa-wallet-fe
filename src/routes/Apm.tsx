import React from "react";
import { useTranslation } from "react-i18next";
import PageContainer from "../components/commons/PageContainer";
import utils from "../utils";
import { FormButtons } from "../components/FormButtons/FormButtons";
import { OUTCOME_ROUTE } from "./models/routeModel";

const Apm = () => {
  const { t } = useTranslation();
  const [loading] = React.useState(false);

  const redirectWithError = () =>
    utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);

  return (
    <PageContainer
      title={t("paypalPage.title")}
      description={t("paypalPage.description")}
    >
      <FormButtons
        type="button"
        handleCancel={redirectWithError}
        submitTitle={`${t("paypalPage.buttons.submit")}`}
        cancelTitle="paypalPage.buttons.cancel"
        disabledSubmit={loading}
        disabledCancel={loading}
      />
    </PageContainer>
  );
};

export default Apm;
