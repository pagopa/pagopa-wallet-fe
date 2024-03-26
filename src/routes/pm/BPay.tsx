import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import PageContainer from "../../components/commons/PageContainer";
import utils from "../../utils";
import { FormButtons } from "../../components/FormButtons/FormButtons";
import BpayAccountItem from "../../components/commons/BpayAccountItem";
import { IBpayAccountItems } from "../../features/onboard/models";
import { OUTCOME_ROUTE, ROUTE_FRAGMENT } from "../models/routeModel";

export default function BPAyPage() {
  const [bpayAccountItems, setBpayAccountItems] = useState<IBpayAccountItems>(
    []
  );
  const { t } = useTranslation();
  const { promiseInProgress: loading } = usePromiseTracker({
    area: "submit-form-button"
  });

  const { sessionToken } = utils.url.getFragments(ROUTE_FRAGMENT.SESSION_TOKEN);

  useEffect(() => {
    if (!bpayAccountItems?.length) {
      const getBpayAccountsItems = async () => {
        pipe(
          await utils.api.pm.bPay.getList(sessionToken),
          E.match(
            () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
            (items) => setBpayAccountItems(items)
          )
        );
      };
      void trackPromise(getBpayAccountsItems(), "page-container");
    }
  }, []);

  const addBpayAccountsToTheWallet = async () =>
    pipe(
      await utils.api.pm.bPay.addWallet(sessionToken, bpayAccountItems),
      E.match(
        () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
        (response) =>
          utils.url.redirectWithOutcome(
            OUTCOME_ROUTE.SUCCESS,
            response === undefined || response.length === 0
              ? undefined
              : response[0].idWallet
          )
      )
    );

  return (
    <PageContainer
      title={t("bPayPage.title")}
      description={t("bPayPage.description", {
        nAccount: bpayAccountItems.length,
        of: bpayAccountItems.length
      })}
    >
      {bpayAccountItems.map((item) => (
        <BpayAccountItem {...item} key={item.token} />
      ))}
      <FormButtons
        handleCancel={() =>
          utils.url.redirectWithOutcome(OUTCOME_ROUTE.CANCELED_BY_USER)
        }
        handleSubmit={() =>
          trackPromise(addBpayAccountsToTheWallet(), "submit-form-button")
        }
        type="button"
        disabledCancel={loading}
        disabledSubmit={bpayAccountItems.length === 0 || loading}
        loadingSubmit={loading}
        submitTitle="bPayPage.formButtons.submit"
        cancelTitle="bPayPage.formButtons.annulla"
      />
    </PageContainer>
  );
}
