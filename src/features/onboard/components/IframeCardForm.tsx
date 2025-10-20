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
import createBuildConfig from "../../../utils/buildConfig";
import { ErrorsType } from "../../../utils/errors/errorsModel";
import { clearNavigationEvents } from "../../../utils/eventListener";
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

  const [buildInstance, setBuildInstance] = React.useState();

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

  const onChange = (id: FieldId, status: FieldStatus) => {
    if (Object.keys(IdFields).includes(id)) {
      setActiveField(id);
      setFormStatus((fields) => ({
        ...fields,
        [id]: status
      }));
    }
  };

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
        const sessionData =
          body.sessionData as SessionWalletCreateResponseData1;
        setCardFormFields(sessionData.cardFormFields);
        utils.storage.setSessionItem(
          utils.storage.SessionItems.orderId,
          body.orderId
        );

        // payment/onboarding success event
        const onReadyForPayment = () => {
          void validation(body);
        };

        // payment/onboarding without 3ds challenge phase
        const onPaymentComplete = () => {
          clearNavigationEvents();
          navigate(`/${WalletRoutes.ESITO}`);
        };

        // payment/onboarding with 3ds challenge phase
        const onPaymentRedirect = (redirect: string) => {
          clearNavigationEvents();
          window.location.replace(redirect);
        };

        const onBuildError = () => {
          setLoading(false);
          if (isPayment) {
            return utils.url.redirectForPaymentWithContextualOnboarding(
              walletId,
              OUTCOME_ROUTE.GENERIC_ERROR,
              transactionId
            );
          }
          window.location.replace(`/${WalletRoutes.ERRORE}`);
        };

        const onAllFieldsLoaded = () => {
          setFormLoading(false);
          setLoading(false);
        };

        try {
          // THIS is mandatory cause the Build class is defined in the external library called NPG SDK
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const newBuild = new Build(
            createBuildConfig({
              onChange,
              onReadyForPayment,
              onPaymentComplete,
              onPaymentRedirect,
              onBuildError,
              onAllFieldsLoaded
            })
          );
          setBuildInstance(newBuild);
        } catch {
          onBuildError();
        }
      };
      void getSessionFields(sessionToken, walletId, onSuccess, onError);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      buildInstance.confirmData(() => setLoading(true));
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
