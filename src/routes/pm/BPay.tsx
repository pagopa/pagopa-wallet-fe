import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
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
    area: "sumbit-form-button"
  });

  const { sessionToken } = utils.url.getFragments(ROUTE_FRAGMENT.SESSION_TOKEN);

  useEffect(() => {
    const getBpayAccountsItems = async () => {
      pipe(
        await utils.api.bPay.getList(sessionToken),
        O.match(
          () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
          (items) => setBpayAccountItems(items)
        )
      );
    };
    void trackPromise(getBpayAccountsItems(), "page-container");
  }, []);

  const addBpayAccountsToTheWallet = async () =>
    pipe(
      await utils.api.bPay.addWallet(sessionToken, bpayAccountItems),
      O.match(
        () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR),
        () => utils.url.redirectWithOutcome(OUTCOME_ROUTE.SUCCESS)
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
          utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR)
        }
        handleSubmit={() =>
          trackPromise(addBpayAccountsToTheWallet(), "sumbit-form-button")
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
