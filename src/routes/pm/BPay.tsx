import { Box } from "@mui/material";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import React, { useEffect, useState } from "react";
import PageContainer from "../../components/commons/PageContainer";
import utils from "../../utils";
import { SessionItems } from "../../utils/storage";
import { RestBPayResponse } from "../../../generated/definitions/payment-manager-v1/RestBPayResponse";

type BpayItem = NonNullable<Readonly<RestBPayResponse["data"]>>[number];

const Item = (props: BpayItem) => {
  const { numberObfuscated, nameObfuscated, surnameObfuscated } = props;
  return (
    <div>
      <div>{numberObfuscated}</div>
      <p>{`${nameObfuscated} ${surnameObfuscated}`}</p>
    </div>
  );
};

export default function BPAyPage() {
  const [bpayAccount, setBpayAccount] = useState<
    NonNullable<RestBPayResponse["data"]>
  >([]);

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
          (bpay) => setBpayAccount(bpay)
        )
      );
    })();
  }, []);

  const continua = async () =>
    pipe(
      await utils.api.bPay.addWallet(sessionToken, bpayAccount),
      O.match(
        () => utils.url.redirectWithOutcame(1),
        () => utils.url.redirectWithOutcame(0)
      )
    );

  return (
    <PageContainer title="bPayPage.title" description="bPayPage.description">
      <Box sx={{ mt: 4 }}>BPay</Box>
      {bpayAccount.map((item) => (
        <Item {...item} key={item.token} />
      ))}
      <button>annulla</button>
      <button disabled={bpayAccount.length === 0} onClick={continua}>
        continua
      </button>
    </PageContainer>
  );
}
