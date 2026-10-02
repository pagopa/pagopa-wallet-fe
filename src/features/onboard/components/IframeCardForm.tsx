import { Box } from "@mui/material";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SessionWalletCreateResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { WalletVerifyRequestAPMDetails } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestAPMDetails";
import { WalletVerifyRequestCardDetails } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestCardDetails";
import { WalletVerifyRequestsResponse } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestsResponse";
import { WalletVerifyRequestContextualCardDetails } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestContextualCardDetails";
import { FormButtons } from "../../../components/FormButtons/FormButtons";
import ErrorModal from "../../../components/commons/ErrorModal";
import {
  OUTCOME_ROUTE,
  ROUTE_FRAGMENT,
  WalletRoutes
} from "../../../routes/models/routeModel";
import utils from "../../../utils";
import { ErrorsType } from "../../../utils/errors/errorsModel";
import { clearNavigationEvents } from "../../../utils/eventListener";
import { useNpgSdk } from "../../../hooks/useNpgSdk";
import { SessionWalletCreateResponseData1 } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponseData";
import { SessionInputDataTypeCardsEnum } from "../../../../generated/definitions/webview-payment-wallet/SessionInputDataTypeCards";
import { IframeCardField } from "./IframeCardField";
import type { FieldId, FieldStatus, FormStatus } from "./types";
import { IdFields } from "./types";

const initialFieldStatus: FieldStatus = {
  isValid: undefined,
  errorCode: null,
  errorMessage: null
};

const initialFieldsState: FormStatus = Object.values(
  IdFields
).reduce<FormStatus>(
  (acc, idField) => ({ ...acc, [idField]: initialFieldStatus }),
  {} as FormStatus
);

interface IframeCardForm {
  isPayment?: boolean;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function IframeCardForm(props: IframeCardForm) {
  // Here I'm using a react reft insted of a state because inserting the state as a
  // dependecy of the effect where the Build instance is create will cause a new initialitation
  // every time the toggle's state change and a new creation of the payment form
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(true);
  const [cardFormFields, setCardFormFields] =
    React.useState<SessionWalletCreateResponseData1["cardFormFields"]>();
  const [activeField, setActiveField] = React.useState<FieldId | undefined>(
    undefined
  );
  const [formStatus, setFormStatus] =
    React.useState<FormStatus>(initialFieldsState);

  // The session response is kept in state because the Build instance can only be
  // created once BOTH the NPG SDK is loaded and the session fields are available,
  // and the order between the two is not guaranteed.
  const [sessionData, setSessionData] =
    React.useState<SessionWalletCreateResponse>();

  // The Build instance is an imperative SDK handle, not render state: a ref keeps
  // it out of the render cycle and lets `handleSubmit` read it synchronously.
  const buildRef = React.useRef<any>(undefined);

  const navigate = useNavigate();

  const { isPayment } = props;

  const formIsValid = (fieldFormStatus: FormStatus) =>
    Object.values(fieldFormStatus).every((el) => el.isValid);

  const onError = () => {
    setLoading(false);
    setErrorModalOpen(true);
  };

  const { sessionToken, walletId, transactionId } = utils.url.getFragments(
    ROUTE_FRAGMENT.SESSION_TOKEN,
    ROUTE_FRAGMENT.WALLET_ID,
    ROUTE_FRAGMENT.TRANSACTION_ID
  );

  utils.storage.setSessionItem(
    utils.storage.SessionItems.sessionToken,
    sessionToken
  );
  utils.storage.setSessionItem(utils.storage.SessionItems.walletId, walletId);

  const onValidation = ({
    details
  }: WalletVerifyRequestsResponse & {
    details:
      | WalletVerifyRequestCardDetails
      | WalletVerifyRequestAPMDetails
      | WalletVerifyRequestContextualCardDetails;
  }) => {
    const cardResult = WalletVerifyRequestCardDetails.decode(details);
    if (E.isRight(cardResult)) {
      const { iframeUrl } = cardResult.right;
      navigate(`/${WalletRoutes.GDI_CHECK}`, {
        state: { gdiIframeUrl: iframeUrl }
      });
      return;
    }

    const apmResult = WalletVerifyRequestAPMDetails.decode(details);
    if (E.isRight(apmResult)) {
      const { redirectUrl } = apmResult.right;
      pipe(
        O.fromNullable(redirectUrl),
        O.match(onError, (redirect) => window.location.replace(redirect))
      );
      return;
    }

    const contextualResult =
      WalletVerifyRequestContextualCardDetails.decode(details);
    if (E.isRight(contextualResult)) {
      utils.url.redirectForPaymentWithContextualOnboarding(
        walletId,
        OUTCOME_ROUTE.SUCCESS,
        transactionId
      );
    } else {
      utils.url.redirectForPaymentWithContextualOnboarding(
        walletId,
        OUTCOME_ROUTE.GENERIC_ERROR,
        transactionId
      );
    }
  };

  const validation = async ({ orderId }: SessionWalletCreateResponse) => {
    pipe(
      await utils.api.npg.validations(sessionToken, orderId, walletId),
      E.match(onError, onValidation)
    );
  };

  // These handlers used to be declared inside the session `onSuccess` callback.
  // They are now passed to `useNpgSdk` and feed the build effect's dependency
  // array, so each is memoised: a fresh identity on every render would re-run
  // that effect and rebuild the SDK.
  const onChange = React.useCallback((id: FieldId, status: FieldStatus) => {
    if (Object.keys(IdFields).includes(id)) {
      setActiveField(id);
      setFormStatus((fields) => ({
        ...fields,
        [id]: status
      }));
    }
  }, []);

  // payment/onboarding success event
  const onReadyForPayment = React.useCallback(() => {
    if (sessionData) {
      void validation(sessionData);
    }
  }, [sessionData]);

  // payment/onboarding without 3ds challenge phase
  const onPaymentComplete = React.useCallback(() => {
    clearNavigationEvents();
    navigate(`/${WalletRoutes.ESITO}`);
  }, [navigate]);

  // payment/onboarding with 3ds challenge phase
  const onPaymentRedirect = React.useCallback((redirect: string) => {
    clearNavigationEvents();
    window.location.replace(redirect);
  }, []);

  const onBuildError = React.useCallback(() => {
    setLoading(false);
    if (isPayment) {
      return utils.url.redirectForPaymentWithContextualOnboarding(
        walletId,
        OUTCOME_ROUTE.GENERIC_ERROR,
        transactionId
      );
    }
    window.location.replace(`/${WalletRoutes.ERRORE}`);
  }, [isPayment, walletId, transactionId]);

  const onAllFieldsLoaded = React.useCallback(() => {
    setFormLoading(false);
    setLoading(false);
  }, []);

  // The NPG SDK is loaded here, once, with its Subresource Integrity check.
  const { sdkReady, sdkError, buildSdk } = useNpgSdk({
    onChange,
    onReadyForPayment,
    onPaymentComplete,
    onPaymentRedirect,
    onBuildError,
    onAllFieldsLoaded
  });

  const getSessionFields = async (
    sessionToken: string,
    walletId: string,
    onSuccess: (body: SessionWalletCreateResponse) => void,
    onError: () => void
  ) => {
    pipe(
      await utils.api.npg.createSessionWallet(sessionToken, walletId, {
        paymentMethodType: SessionInputDataTypeCardsEnum.cards
      }),
      E.match(onError, onSuccess)
    );
  };

  React.useEffect(() => {
    if (!cardFormFields) {
      const onSuccess = (body: SessionWalletCreateResponse) => {
        const responseData =
          body.sessionData as SessionWalletCreateResponseData1;
        setCardFormFields(responseData.cardFormFields);
        utils.storage.setSessionItem(
          utils.storage.SessionItems.orderId,
          body.orderId
        );
        // Handing the response to state, rather than building the SDK here as
        // before, is what lets the build wait for `sdkReady` too.
        setSessionData(body);
      };
      void getSessionFields(sessionToken, walletId, onSuccess, onError);
    }
  }, []);

  /**
   * The Build instance can only be created once the NPG SDK has been loaded and
   * passed its SRI check (`sdkReady`) AND the session fields have been received
   * (`sessionData`). The two happen concurrently, in no guaranteed order, so this
   * effect waits for both. `buildRef` guards against creating a second instance.
   *
   * If the integrity hash cannot be fetched or SRI validation fails, `sdkReady`
   * stays false and no Build is ever created, so no payment can use an
   * unvalidated SDK.
   */
  React.useEffect(() => {
    if (!sdkReady || !sessionData || buildRef.current) {
      return;
    }
    try {
      // eslint-disable-next-line functional/immutable-data
      buildRef.current = buildSdk();
    } catch {
      onBuildError();
    }
  }, [sdkReady, sessionData, buildSdk, onBuildError]);

  // error path -> `new Build` throws without the SDK: otherwise the form 
  // would wait for `sdkReady` forever.
  React.useEffect(() => {
    if (sdkError) {
      onBuildError();
    }
  }, [sdkError, onBuildError]);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      // Throws if the Build was never created (SDK unloaded or SRI failed), which
      // the catch below turns into the usual error path.
      buildRef.current.confirmData(() => setLoading(true));
    } catch (e) {
      onError(); // possible redirect to app with outcome != 0
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <form id="iframe-card-form" onSubmit={handleSubmit}>
        <Box>
          <Box>
            <IframeCardField
              label={t("inputCardPage.formFields.number")}
              fields={cardFormFields}
              id={"CARD_NUMBER"}
              errorCode={formStatus.CARD_NUMBER?.errorCode}
              errorMessage={formStatus.CARD_NUMBER?.errorMessage}
              isValid={formStatus.CARD_NUMBER?.isValid}
              activeField={activeField}
              loaded={!formLoading}
            />
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            sx={{ gap: 2 }}
          >
            <Box sx={{ flex: "1 1 0" }}>
              <IframeCardField
                label={t("inputCardPage.formFields.expirationDate")}
                fields={cardFormFields}
                id={"EXPIRATION_DATE"}
                errorCode={formStatus.EXPIRATION_DATE?.errorCode}
                errorMessage={formStatus.EXPIRATION_DATE?.errorMessage}
                isValid={formStatus.EXPIRATION_DATE?.isValid}
                activeField={activeField}
                loaded={!formLoading}
              />
            </Box>
            <Box width="50%">
              <IframeCardField
                label={t("inputCardPage.formFields.cvv")}
                fields={cardFormFields}
                id={"SECURITY_CODE"}
                errorCode={formStatus.SECURITY_CODE?.errorCode}
                errorMessage={formStatus.SECURITY_CODE?.errorMessage}
                isValid={formStatus.SECURITY_CODE?.isValid}
                activeField={activeField}
                loaded={!formLoading}
              />
            </Box>
          </Box>
          <Box>
            <IframeCardField
              label={t("inputCardPage.formFields.name")}
              fields={cardFormFields}
              id={"CARDHOLDER_NAME"}
              errorCode={formStatus.CARDHOLDER_NAME?.errorCode}
              errorMessage={formStatus.CARDHOLDER_NAME?.errorMessage}
              isValid={formStatus.CARDHOLDER_NAME?.isValid}
              activeField={activeField}
              loaded={!formLoading}
            />
          </Box>
        </Box>
        <FormButtons
          loadingSubmit={loading}
          type="submit"
          submitTitle="inputCardPage.formButtons.submit"
          disabledSubmit={loading || !formIsValid(formStatus)}
          handleSubmit={handleSubmit}
          disabledCancel
        />
      </form>
      {!!errorModalOpen && (
        <ErrorModal
          error={ErrorsType.GENERIC_ERROR}
          open={errorModalOpen}
          onClose={() => {
            setErrorModalOpen(false);
          }}
          titleId="iframeCardFormErrorTitleId"
          errorId="iframeCardFormErrorId"
          bodyId="iframeCardFormErrorBodyId"
        />
      )}
    </>
  );
}
