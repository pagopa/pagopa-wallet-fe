import { Box, FormControlLabel } from "@mui/material";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SessionWalletCreateResponse } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponse";
import { WalletVerifyRequestAPMDetails } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestAPMDetails";
import { WalletVerifyRequestCardDetails } from "../../../../generated/definitions/webview-payment-wallet/WalletVerifyRequestCardDetails";
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
import { SessionWalletCreateResponseData1 } from "../../../../generated/definitions/webview-payment-wallet/SessionWalletCreateResponseData";
import { SessionInputDataTypeCardsEnum } from "../../../../generated/definitions/webview-payment-wallet/SessionInputDataTypeCards";
import { getConfigOrThrow } from "../../../config";
import { useNpgSdk } from "../../../hooks/useNpgSdk";
import { IframeCardField } from "./IframeCardField";
import type { FieldId, FieldStatus, FormStatus } from "./types";
import { IdFields } from "./types";
import CustomSwitch from "./CustomSwitch";

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
  // Here I'm using a react reft instead of a state because inserting the state as a
  // dependency of the effect where the Build instance is create will cause a new initialization
  // every time the toggle's state change and a new creation of the payment form
  const saveMethod = React.useRef(true);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
  const { WALLET_ONBOARD_SWITCH_ON_PAYMENT_PAGE } = getConfigOrThrow();

  const { sdkReady, buildSdk } = useNpgSdk();

  const formIsValid = (fieldFormStatus: FormStatus) =>
    Object.values(fieldFormStatus).every((el) => el.isValid);

  const onError = () => {
    setLoading(false);
    setErrorModalOpen(true);
  };

  const { sessionToken, walletId } = utils.url.getFragments(
    ROUTE_FRAGMENT.SESSION_TOKEN,
    ROUTE_FRAGMENT.WALLET_ID
  );

  utils.storage.setSessionItem(
    utils.storage.SessionItems.sessionToken,
    sessionToken
  );
  utils.storage.setSessionItem(utils.storage.SessionItems.walletId, walletId);

  const getSdkConfig = (body: SessionWalletCreateResponse) => ({
    onChange: (id: FieldId, status: FieldStatus) => {
      if (Object.keys(IdFields).includes(id)) {
        setActiveField(id);
        setFormStatus((fields) => ({
          ...fields,
          [id]: status
        }));
      }
    },
    // payment/onboarding success event
    onReadyForPayment: () => {
      if (isPayment) {
        return utils.url.redirectToIoAppForPayment(
          walletId,
          OUTCOME_ROUTE.SUCCESS,
          WALLET_ONBOARD_SWITCH_ON_PAYMENT_PAGE ? saveMethod.current : undefined
        );
      }
      void validation(body);
    },
    // payment/onboarding without 3ds challenge phase
    onPaymentComplete: () => {
      clearNavigationEvents();
      navigate(`/${WalletRoutes.ESITO}`);
    },
    // payment/onboarding with 3ds challenge phase
    onPaymentRedirect: (redirect: string) => {
      clearNavigationEvents();
      window.location.replace(redirect);
    },
    onBuildError: () => {
      setLoading(false);
      if (isPayment) {
        return utils.url.redirectToIoAppForPayment(
          walletId,
          OUTCOME_ROUTE.GENERIC_ERROR,
          WALLET_ONBOARD_SWITCH_ON_PAYMENT_PAGE ? saveMethod.current : undefined
        );
      }
      // TODO check if this navigation is correct
      utils.url.redirectWithOutcome(OUTCOME_ROUTE.GENERIC_ERROR);
    }
  });

  const onValidation = ({
    details
  }: {
    details: WalletVerifyRequestCardDetails | WalletVerifyRequestAPMDetails;
  }) => {
    pipe(
      WalletVerifyRequestCardDetails.decode(details),
      E.fold(
        () =>
          pipe(
            WalletVerifyRequestAPMDetails.decode(details),
            E.fold(onError, (detail) => {
              pipe(
                O.fromNullable(detail.redirectUrl),
                O.match(onError, (redirect) =>
                  window.location.replace(redirect)
                )
              );
            })
          ),
        (detail) =>
          navigate(`/${WalletRoutes.GDI_CHECK}`, {
            state: { gdiIframeUrl: detail.iframeUrl }
          })
      )
    );
  };

  const validation = async ({ orderId }: SessionWalletCreateResponse) => {
    pipe(
      await utils.api.npg.validations(sessionToken, orderId, walletId),
      E.match(onError, onValidation)
    );
  };

  const onSuccess = (body: SessionWalletCreateResponse) => {
    const sessionData = body.sessionData as SessionWalletCreateResponseData1;
    setCardFormFields(sessionData.cardFormFields);
    utils.storage.setSessionItem(
      utils.storage.SessionItems.orderId,
      body.orderId
    );

    const sdkConfig = getSdkConfig(body);

    try {
      const sdkInstance = buildSdk(sdkConfig);
      setBuildInstance(sdkInstance);
    } catch {
      sdkConfig.onBuildError();
    }
  };

  const getSessionFields = async (sessionToken: string, walletId: string) => {
    pipe(
      await utils.api.npg.createSessionWallet(sessionToken, walletId, {
        paymentMethodType: SessionInputDataTypeCardsEnum.cards
      }),
      E.match(onError, onSuccess)
    );
  };

  React.useEffect(() => {
    if (!cardFormFields && sdkReady) {
      void getSessionFields(sessionToken, walletId);
    }
  }, [sdkReady]);

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

  const showSaveMethodToggle =
    isPayment && WALLET_ONBOARD_SWITCH_ON_PAYMENT_PAGE;

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
            />
          </Box>
          <Box>
            {showSaveMethodToggle ? (
              <FormControlLabel
                control={
                  <CustomSwitch
                    defaultChecked
                    disabled={!cardFormFields}
                    onChange={(_e, checked) => {
                      // eslint-disable-next-line functional/immutable-data
                      saveMethod.current = checked;
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={t("inputCardPage.saveMethod")}
                labelPlacement="start"
                sx={{
                  justifyContent: "space-between",
                  marginLeft: 0,
                  width: "100%"
                }}
              />
            ) : null}
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
