import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import PageContainer from "../../components/commons/PageContainer";
import utils from "../../utils";
import { SessionItems } from "../../utils/storage";
import { RestBPayResponse } from "../../../generated/definitions/payment-manager-v1/RestBPayResponse";
import { FormButtons } from "../../components/FormButtons/FormButtons";
import BpayCardItem from "../../components/commons/BpayCardItem";

type IBpayItem = NonNullable<Readonly<RestBPayResponse["data"]>>[number];

export default function BPAyPage() {
  const [bpayCardItems, setBpayCardItems] = useState<Array<IBpayItem>>([]);
  const { t } = useTranslation();
  const { promiseInProgress: loading } = usePromiseTracker({
    area: "sumbit-form-button"
  });

  const sessionToken = utils.url.getFragmentParameter(
    window.location.href,
    SessionItems.sessionToken
  );

  useEffect(() => {
    const start = async () => {
      pipe(
        await utils.api.bPay.getList(sessionToken),
        O.match(
          () => utils.url.redirectWithOutcame(1),
          // @ts-ignore
          (items) => setBpayCardItems(items)
        )
      );
    };
    void trackPromise(start(), "page-container");
  }, []);

  const continua = async () =>
    pipe(
      await utils.api.bPay.addWallet(sessionToken, bpayCardItems),
      O.match(
        () => utils.url.redirectWithOutcame(1),
        () => utils.url.redirectWithOutcame(0)
      )
    );

  return (
    <PageContainer
      title={t("bPayPage.title")}
      description={t("bPayPage.description", {
        nAccount: setBpayCardItems.length,
        of: setBpayCardItems.length
      })}
    >
      {bpayCardItems.map((item) => (
        <BpayCardItem {...item} key={item.token} />
      ))}
      <FormButtons
        handleCancel={() => utils.url.redirectWithOutcame(1)}
        handleSubmit={() => trackPromise(continua(), "sumbit-form-button")}
        type="button"
        disabledCancel={loading}
        disabledSubmit={bpayCardItems.length === 0 || loading}
        loadingSubmit={loading}
        submitTitle="bPayPage.formButtons.submit"
        cancelTitle="bPayPage.formButtons.annulla"
      />
    </PageContainer>
  );
}
