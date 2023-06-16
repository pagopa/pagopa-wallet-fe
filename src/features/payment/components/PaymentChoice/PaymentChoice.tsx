/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable functional/immutable-data */
import React from "react";
import { useNavigate } from "react-router";
import ClickableFieldContainer from "../../../../components/TextFormField/ClickableFieldContainer";
import {
  PaymentMethodRoutes,
  TransactionMethods,
} from "../../../../routes/models/paymentMethodRoutes";
import {
  SessionItems,
  setSessionItem,
} from "../../../../utils/storage/sessionStorage";
import { PaymentInstruments } from "../../models/paymentModel";
import { DisabledPaymentMethods, EnabledPaymentMethods } from "./PaymentMethod";

function groupByTypeCode(array: Array<PaymentInstruments>) {
  return array.reduce((acc, current) => {
    if (!acc[current.paymentTypeCode]) {
      acc[current.paymentTypeCode] = [];
    }

    acc[current.paymentTypeCode].push(current);
    return acc;
  }, {} as Record<TransactionMethods, Array<PaymentInstruments>>);
}

function getSortedPaymentMethods(
  groupedMethods: Record<TransactionMethods, Array<PaymentInstruments>>
) {
  const paymentMethods: Array<PaymentInstruments> = [];
  const methodCP = groupedMethods[TransactionMethods.CP]?.[0];
  const methodCC = groupedMethods[TransactionMethods.CC]?.[0];

  for (const key in groupedMethods) {
    if (
      key !== TransactionMethods.CP &&
      key !== TransactionMethods.CC &&
      PaymentMethodRoutes[key as TransactionMethods]
    ) {
      paymentMethods.push(groupedMethods[key as TransactionMethods][0]);
    }
  }

  const sortedMethods = paymentMethods.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  methodCC && sortedMethods.unshift(methodCC);
  methodCP && sortedMethods.unshift(methodCP);

  return sortedMethods;
}

export function PaymentChoice(props: {
  amount: number;
  paymentInstruments: Array<PaymentInstruments>;
  loading?: boolean;
}) {
  const navigate = useNavigate();

  const handleClickOnMethod = React.useCallback(
    (paymentType: TransactionMethods, paymentMethodId: string) => {
      const route: string = PaymentMethodRoutes[paymentType]?.route;
      setSessionItem(SessionItems.paymentMethod, {
        paymentMethodId,
        paymentTypeCode: paymentType,
      });
      /* void getPaymentPSPList({
        paymentMethodId,
        onError: onErrorGetPSP,
        onResponse: (resp) => {
          const firstPsp = sortPsp(resp);
          setPspSelected({
            pspCode: firstPsp[0].idPsp || "",
            fee: firstPsp[0].commission,
            businessName: firstPsp[0].name || "",
          });
        },
      }); */
      navigate(`/${route}`);
    },
    []
  );

  const getPaymentMethods = React.useCallback(
    (status: "ENABLED" | "DISABLED" = "ENABLED") =>
      getSortedPaymentMethods(
        groupByTypeCode(
          props.paymentInstruments.filter((method) => method.status === status)
        )
      ),
    [props.amount, props.paymentInstruments]
  );

  return (
    <>
      {props.loading ? (
        Array(3)
          .fill(1)
          .map((_, index) => <ClickableFieldContainer key={index} loading />)
      ) : (
        <>
          <EnabledPaymentMethods
            methods={getPaymentMethods()}
            onClick={handleClickOnMethod}
          />
          <DisabledPaymentMethods methods={getPaymentMethods("DISABLED")} />
        </>
      )}
    </>
  );
}
