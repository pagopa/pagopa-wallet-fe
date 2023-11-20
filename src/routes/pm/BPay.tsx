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

export default function BPAyPage() {
  const [bpayAccountItems, setBpayAccountItems] = useState<IBpayAccountItems>(
    []
  );
  const { t } = useTranslation();
  const { promiseInProgress: loading } = usePromiseTracker({
    area: "sumbit-form-button"
  });

  const sessionToken = utils.url.getFragmentParameter(
    window.location.href,
    "sessionToken"
  );

  useEffect(() => {
    const getBpayAccountsItems = async () => {
      pipe(
        await utils.api.bPay.getList(sessionToken),
        O.match(
          () => utils.url.redirectWithOutcome(1),
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
        () => utils.url.redirectWithOutcome(1),
        () => utils.url.redirectWithOutcome(0)
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
        handleCancel={() => utils.url.redirectWithOutcome(1)}
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