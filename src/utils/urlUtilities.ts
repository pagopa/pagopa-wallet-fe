import { getConfigOrThrow } from "../config";
import { OUTCOME_ROUTE, ROUTE_FRAGMENT } from "../routes/models/routeModel";

const {
  WALLET_CONFIG_API_HOST: API_HOST,
  WALLET_OUTCOME_API_BASEPATH: WALLET_OUTCOME_BASEPATH
} = getConfigOrThrow();

/**
 * @private
 * This function requires a valid URI with a querystrings as the fragment URI
 * example: http://dev.checkout.it/gdi-check#param1=value1&param2=value2.
 * The function return an empty string if the uri parameter is not valid
 * or the parameter can't be found
 */
function getFragmentParameter(uri: string, name: ROUTE_FRAGMENT): string {
  try {
    const fragment = new URL(uri).hash.substring(1);
    const urlParams = new URLSearchParams(fragment);
    return urlParams.get(name) || "";
  } catch (e) {
    return "";
  }
}

/**
 * returns all requested fragments in an object using the fragments as keys
 * example: http://dev.checkout.it/gdi-check#param1=value1&param2=value2&param3&....
 * The object values are set to empty string if its fragment is not found
 * or the parameter can't be found
 */
function getFragments(
  ...fragments: Array<ROUTE_FRAGMENT>
): Record<ROUTE_FRAGMENT, string> {
  const uri = window.location.href;
  return fragments.reduce<Record<string, string>>(
    (acc, fragment) => ({
      ...acc,
      [fragment]: getFragmentParameter(uri, fragment)
    }),
    {}
  );
}

/**
 * This function executes a window.location.replace on a particular url with a numeric outcome
 * from the outcome parameter. The IO APP will use the url and the outcome to give a feedback to the user
 */
const redirectWithOutcome = (
  outcome: OUTCOME_ROUTE | number,
  walletId?: number | string
) => {
  const walletIdParam =
    walletId === undefined
      ? ""
      : `&walletId=${
          typeof walletId == "number" ? convertToUUIDHex(walletId) : walletId
        }`;
  window.location.replace(
    `${API_HOST}${WALLET_OUTCOME_BASEPATH}/wallets/outcomes?outcome=${outcome}${walletIdParam}`
  );
};

const convertToUUIDHex = (walletId: number) => {
  const walletIdHex = walletId.toString(16).padStart(16, "0");
  return `00000000-0000-4000-${walletIdHex.substring(
    0,
    4
  )}-${walletIdHex.substring(4)}`;
};
/**
 * This function is used for payment with contextual onboarding flow started from IO app.
 * An outcome url is build and a navigation is performed to that URL in order to return
 * control to IO app (using magic url iowallet:// schema navigation)
 */
const redirectForPaymentWithContextualOnboarding = (
  walletId: string,
  outcome: OUTCOME_ROUTE,
  transactionId: string
) => {
  const url = `${API_HOST}${WALLET_OUTCOME_BASEPATH}/transactions/${transactionId}/wallets/${walletId}/outcomes?outcome=${outcome}`;
  window.location.replace(url);
};

export default {
  redirectWithOutcome,
  getFragments,
  redirectForPaymentWithContextualOnboarding
};
