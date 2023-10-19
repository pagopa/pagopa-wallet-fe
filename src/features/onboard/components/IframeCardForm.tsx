import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { WalletFieldsResponse } from "../../../../generated/definitions/webview-payment-wallet/WalletFieldsResponse";
import { FormButtons } from "../../../components/FormButtons/FormButtons";
import { npgSessionsFields } from "../../../utils/api/helper";
import createBuildConfig from "../../../utils/buildConfig";
import { ErrorsType } from "../../../utils/errors/errorsModel";
import ErrorModal from "../../../components/commons/ErrorModal";
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
  const [form, setForm] = React.useState<WalletFieldsResponse>();
  const [activeField, setActiveField] = React.useState<FieldId | undefined>(
    undefined
  );
  const [formStatus, setFormStatus] =
    React.useState<FormStatus>(initialFieldsState);

  const [buildInstance, setBuildInstance] = React.useState();

  const formIsValid = (fieldFormStatus: FormStatus) =>
    Object.values(fieldFormStatus).every((el) => el.isValid);

  const onError = () => {
    setLoading(false);
    setErrorModalOpen(true);
  };

  const transaction = async () => {
    console.log("TO-DO!");
  };
  /*
  const transaction = async () => {
    const transactionId = (
      getSessionItem(SessionItems.transaction) as
        | NewTransactionResponse
        | undefined
    )?.transactionId;
    if (transactionId) {
      void retrievePaymentSession(
        (
          getSessionItem(SessionItems.paymentMethod) as
            | PaymentMethod
            | undefined
        )?.paymentMethodId || "",
        getSessionItem(SessionItems.orderId) as string
      );
    } else {
      await activatePayment({
        token,
        onResponseActivate: retrievePaymentSession,
        onErrorActivate: onError
      });
    }
  };
  */

  const onChange = (id: FieldId, status: FieldStatus) => {
    if (Object.keys(IdFields).includes(id)) {
      setActiveField(id);
      setFormStatus((fields) => ({
        ...fields,
        [id]: status
      }));
    }
  };

  React.useEffect(() => {
    if (!form) {
      const onResponse = (body: WalletFieldsResponse) => {
        setForm(body);
        const onReadyForPayment = () => void transaction();

        const onPaymentComplete = () => {
          console.log("TO-DO!");
          window.location.replace(`/`);
        };

        const onPaymentRedirect = (urlredirect: string) => {
          window.location.replace(urlredirect);
        };

        const onBuildError = () => {
          setLoading(false);
          console.log("TO-DO!");
          // window.location.replace(`/`);
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

      void npgSessionsFields(onError, onResponse);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      buildInstance.confirmData(() => setLoading(true));
    } catch (e) {
      onError();
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
            // window.location.replace(`/${CheckoutRoutes.ERRORE}`);
          }}
          titleId="iframeCardFormErrorTitleId"
          errorId="iframeCardFormErrorId"
          bodyId="iframeCardFormErrorBodyId"
        />
      )}
    </>
  );
}
