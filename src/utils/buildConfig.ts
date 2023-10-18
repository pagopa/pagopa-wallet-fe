import { FieldId, FieldStatus } from "../features/onboard/components/types";
import {
  NpgEvtData,
  NpgFlowState,
  NpgFlowStateEvtData
} from "../features/onboard/models/npgModel";

interface BuildConfig {
  onChange: (field: FieldId, fieldStatus: FieldStatus) => void;
  onReadyForPayment: () => void;
  onPaymentComplete: () => void;
  onPaymentRedirect: (urlRedirect: string) => void;
  onBuildError: () => void;
}

export default (buildConfig: BuildConfig) => {
  const { hostname, protocol, port } = window.location;

  const cssPath = `${protocol}//${hostname}${
    process.env.NODE_ENV === "development" ? `:${port}` : ""
  }/npg/style.css`;

  const {
    onBuildError,
    onChange,
    onReadyForPayment,
    onPaymentComplete,
    onPaymentRedirect
  } = buildConfig;
  return {
    onBuildSuccess({ id }: NpgEvtData) {
      // write some code to manage the successful data entering in the specified field: evtData.id
      onChange(id, {
        isValid: true,
        errorCode: null,
        errorMessage: null
      });
    },
    onBuildError({ id, errorCode, errorMessage }: NpgEvtData) {
      // write some code to manage the wrong data entering in the specified field: evtData.id
      // the action can be finely tuned based on the provided error code available at evtData.errorCode
      // the possible cases are:
      //   HF0001 -generic build field error
      //   HF0002 -temporary unavailability of the service
      //   HF0003 -session expired–the payment experience shall be restarted from the post orders/build
      //   HF0004 -card validation error–the key check on the card number was failed
      //   HF0005 -brand not found–the card brand is not in the list of supported brands
      //   HF0006 -expiration date exceeded–the provided card is expired
      //   HF0007 –internal error –if the issue persists the payment has to be restarted
      //   HF0009 –3DS GDI verification failed –the payment experience has to be stopped with failure.
      onChange(id, {
        isValid: false,
        errorCode,
        errorMessage
      });
    },
    onConfirmError(_evtData: NpgEvtData) {
      // this event is returned as a consequence of the invocation of confirmData() SDK function.
      // the possible cases are:
      //   HF0002 –temporary unavailability of the service
      //   HF0003 -session expired–the payment experience shall be restarted from the post orders/build
      //   HF0007 –internal error–if the issue persists the payment has to be restarted
      onBuildError();
    },
    onBuildFlowStateChange(
      npgFlowStateEvtData: NpgFlowStateEvtData,
      npgFlowState: NpgFlowState
    ) {
      // this event is returned for each state transition of the payment state machine.
      // the possible states expressed by the value state are:
      // READY_FOR_PAYMENT: the card data has been properly collected and it is now possible to
      //   invoke the server to server
      //   posthttps://{nexiDomain}/api/phoenix-0.0/psp/api/v1/build/cardData?orderId={theorderId}
      //   to collect the non-PCI card information.
      // REDIRECTED_TO_EXTERNAL_DOMAIN: when this state is provided, the browser has to be redirected to
      //   the evtData.data.url external domain for strong customer authentication (i.e ACS URL).
      // PAYMENT_COMPLETE: the payment experience is finished. It is required to invoke
      //   the get https://{nexiDomain}/api/phoenix-0.0/psp/api/v1/build/state?orderId={theorderId}  },
      switch (npgFlowState) {
        case NpgFlowState.READY_FOR_PAYMENT:
          void onReadyForPayment();
          break;
        case NpgFlowState.PAYMENT_COMPLETE:
          void onPaymentComplete();
          break;
        case NpgFlowState.REDIRECTED_TO_EXTERNAL_DOMAIN:
          void onPaymentRedirect(npgFlowStateEvtData.data.url);
          break;
        default:
          onBuildError();
      }
    },
    cssLink: cssPath,
    defaultComponentCssClassName: "npg-component",
    defaultContainerCssClassName: "npg-container"
    // any dependency will initialize the build instance more than one time
    // and I think it's not a good idea. For the same reason I am not using
    // a react state to track the form status
  };
};
