import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { toError } from "fp-ts/lib/Either";
import { createClient as createEcommerceClient } from "../../../generated/definitions/webview-payment-wallet/client";
import { PaymentMethodsResponse } from "../../../generated/definitions/webview-payment-wallet/PaymentMethodsResponse";
import { ErrorsType } from "../errors/checkErrorsModel";
import {
  PaymentMethodRoutes,
  TransactionMethods
} from "../../routes/models/paymentMethodRoutes";

const { API_HOST = "", API_BASEPATH, NODE_ENV } = process.env;

/**
 * Api client for payment ecommerce API
 */
const apiPaymentEcommerceClient = createEcommerceClient({
  baseUrl: NODE_ENV === "development" ? "" : API_HOST,
  basePath: API_BASEPATH,
  fetchApi: fetch
});

const getAllPaymentMethods = async (
  bearerAuth: string,
  onError: (e: string) => void,
  onResponse: (data: PaymentMethodsResponse["paymentMethods"]) => void
) => {
  // mixpanel.track(PAYMENT_METHODS_ACCESS.value, {
  //   EVENT_ID: PAYMENT_METHODS_ACCESS.value
  // });
  const list: PaymentMethodsResponse["paymentMethods"] = await pipe(
    TE.tryCatch(
      () => apiPaymentEcommerceClient.getAllPaymentMethods({ bearerAuth }),
      () => {
        // mixpanel.track(PAYMENT_METHODS_NET_ERROR.value, {
        //   EVENT_ID: PAYMENT_METHODS_NET_ERROR.value
        // });
        onError(ErrorsType.STATUS_ERROR);
        return toError;
      }
    ),
    TE.fold(
      () => async () => {
        // mixpanel.track(PAYMENT_METHODS_SVR_ERROR.value, {
        //   EVENT_ID: PAYMENT_METHODS_SVR_ERROR.value
        // });
        onError(ErrorsType.STATUS_ERROR);
        return [];
      },
      (myResExt) => async () =>
        pipe(
          myResExt,
          E.fold(
            () =>
              // mixpanel.track(PAYMENT_METHODS_RESP_ERROR.value, {
              //   EVENT_ID: PAYMENT_METHODS_RESP_ERROR.value
              // });
              [],
            (myRes) => {
              if (myRes.status === 200) {
                // mixpanel.track(PAYMENT_METHODS_SUCCESS.value, {
                //   EVENT_ID: PAYMENT_METHODS_SUCCESS.value
                // });
                return myRes.value.paymentMethods?.filter(
                  (method) =>
                    !!PaymentMethodRoutes[
                      method.paymentTypeCode as TransactionMethods
                    ]
                );
                // .map((method) => ({
                //   ...method,
                //   label:
                //     PaymentMethodRoutes[
                //       method.paymentTypeCode as TransactionMethods
                //     ]?.label || method.name,
                //   asset:
                //     PaymentMethodRoutes[
                //       method.paymentTypeCode as TransactionMethods
                //     ]?.asset // when asset will be added to the object, add || method.asset
                // }));
              } else {
                // mixpanel.track(PAYMENT_METHODS_RESP_ERROR.value, {
                //   EVENT_ID: PAYMENT_METHODS_RESP_ERROR.value
                // });
                return [];
              }
            }
          )
        )
    )
  )();
  onResponse(list);
};

export default {
  getAllPaymentMethods
};
