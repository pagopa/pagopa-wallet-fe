import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageContainer from "../../components/commons/PageContainer";
import utils from "../../utils";
import { SessionItems } from "../../utils/storage";
import { RestBPayResponse } from "../../../generated/definitions/payment-manager-v1/RestBPayResponse";
import { FormButtons } from "../../components/FormButtons/FormButtons";
import BpayCardItem from "../../components/commons/BpayCardItem";

type IBpayItem = NonNullable<Readonly<RestBPayResponse["data"]>>[number];

const mock: Array<IBpayItem> = [
  {
    bankName: "string",
    groupCode: "string",
    instituteCode: "string",
    nameObfuscated: "Pippo",
    numberEncrypted: "test",
    numberObfuscated: "+3932******50",
    paymentInstruments: [
      {
        defaultReceive: true,
        defaultSend: true,
        ibanObfuscated: "string"
      }
    ],
    serviceState: "string",
    surnameObfuscated: "Baudo",
    token: "string",
    uid: "string",
    uidHash: "string"
  }
];

export default function BPAyPage() {
  const [bpayCardItems, setBpayCardItems] = useState<Array<IBpayItem>>(mock);
  const { t } = useTranslation();

  const sessionToken = utils.url.getFragmentParameter(
    window.location.href,
    SessionItems.sessionToken
  );

  useEffect(() => {
    void (async () => {
      pipe(
        await utils.api.bPay.getList(sessionToken),
        O.match(
          () => utils.url.redirectWithOutcame(1),
          // @ts-ignore
          (items) => setBpayCardItems(items)
        )
      );
    })();
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
        handleSubmit={() => continua()}
        disabledSubmit={bpayCardItems.length === 0}
        submitTitle="bPayPage.formButtons.submit"
        cancelTitle="bPayPage.formButtons.annulla"
      />
    </PageContainer>
  );
}
