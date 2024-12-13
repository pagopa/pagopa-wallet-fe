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
    const gdiFragmentUrl = urlParams.get(name);
    if (gdiFragmentUrl === null) {
      return "";
    }
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
 * This function convert number outcome with related enum OUTCOME_ROUTE
 */
const getOutcomeRouteFromValue = (
  outcome: number | undefined
) => {
  switch(outcome) {
    case 0:
      return OUTCOME_ROUTE.SUCCESS
    case 1:
      return OUTCOME_ROUTE.GENERIC_ERROR
    case 8:
      return OUTCOME_ROUTE.CANCELED_BY_USER
    case 14:
      return OUTCOME_ROUTE.AUTH_ERROR
    case 15:
      return OUTCOME_ROUTE.CONFLICT
    case 16:
      return OUTCOME_ROUTE.ACCOUNT_BPAY_NOT_PRESENT
    default:
      return OUTCOME_ROUTE.GENERIC_ERROR;
  }
};

/**
 * This function executes a window.location.replace on a particular url with a numeric outcome
 * from the outcome parameter. The IO APP will use the url and the outcome to give a feedback to the user
 */
const redirectWithOutcome = (
  outcome: OUTCOME_ROUTE,
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
 * This function is used for not-registerd payment flow started from IO app
 * When called, after the user enters the card data, executes a redirect
 * to a specif url so that the flow can continue in app. If the save method toggle is avaiable
 * the toggle's value is send as query paramas
 */
const redirectToIoAppForPayment = (
  walletId: string,
  outcome: OUTCOME_ROUTE,
  saveMethod?: boolean
) => {
  const saveMethodParameter =
    saveMethod === undefined ? "" : `&saveMethod=${saveMethod}`;
  const url = `${API_HOST}${WALLET_OUTCOME_BASEPATH}/transactions/wallets/${walletId}/outcomes?outcome=${outcome}${saveMethodParameter}`;
  window.location.replace(url);
};

export default {
  getOutcomeRouteFromValue,
  redirectWithOutcome,
  getFragments,
  redirectToIoAppForPayment
};
