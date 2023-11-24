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
import { FormButtons } from "../../../components/FormButtons/FormButtons";
import ErrorModal from "../../../components/commons/ErrorModal";
import {
  OUTCOME_ROUTE,
  ROUTE_FRAGMENT,
  WalletRoutes
} from "../../../routes/models/routeModel";
import utils from "../../../utils";
import { npg } from "../../../utils/api/npg";
import createBuildConfig from "../../../utils/buildConfig";
import { ErrorsType } from "../../../utils/errors/errorsModel";
import { clearNavigationEvents } from "../../../utils/eventListener";
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

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function IframeCardForm() {
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<SessionWalletCreateResponse>();
  const [activeField, setActiveField] = React.useState<FieldId | undefined>(
    undefined
  );
  const [formStatus, setFormStatus] =
    React.useState<FormStatus>(initialFieldsState);

  const [buildInstance, setBuildInstance] = React.useState();

  const navigate = useNavigate();

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

  const onValidation = ({
    details
  }: WalletVerifyRequestsResponse & {
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
      await npg.validations(sessionToken, orderId, walletId),
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
      await npg.sessionsFields(sessionToken, walletId),
      E.match(onError, onSuccess)
    );
  };

  React.useEffect(() => {
    if (!form) {
      const onSuccess = (body: SessionWalletCreateResponse) => {
        setForm(body);
        const onReadyForPayment = () => void validation(body);

        const onPaymentComplete = () => {
          clearNavigationEvents();
          utils.url.redirectWithOutcome(OUTCOME_ROUTE.SUCCESS);
        };

        const onPaymentRedirect = (redirect: string) => {
          clearNavigationEvents();
          window.location.replace(redirect);
        };

        const onBuildError = () => {
          setLoading(false);
          window.location.replace(`/${WalletRoutes.ERRORE}`);
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
              onBuildError
            })
          );
          setBuildInstance(newBuild);
        } catch {
          onBuildError();
        }
      };

      void getSessionFields(sessionToken, walletId, onSuccess, onError);
    }
  }, [form?.orderId]);

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
              fields={form?.cardFormFields}
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
                fields={form?.cardFormFields}
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
                fields={form?.cardFormFields}
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
              fields={form?.cardFormFields}
              id={"CARDHOLDER_NAME"}
              errorCode={formStatus.CARDHOLDER_NAME?.errorCode}
              errorMessage={formStatus.CARDHOLDER_NAME?.errorMessage}
              isValid={formStatus.CARDHOLDER_NAME?.isValid}
              activeField={activeField}
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
