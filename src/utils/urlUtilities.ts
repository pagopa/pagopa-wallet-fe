import { getConfigOrThrow } from "../config";
import { OUTCOME_ROUTE, ROUTE_FRAGMENT } from "../routes/models/routeModel";

const WALLET_OUTCOME_BASEPATH = getConfigOrThrow().WALLET_OUTCOME_API_BASEPATH;

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
 * This function executes a window.location.replace on a particular url with a numeric outcome
 * from the outcome parameter. The IO APP will use the url and the outcome to give a feedback to the user
 */
const redirectWithOutcome = (outcome: OUTCOME_ROUTE | number) =>
  window.location.replace(
    `iowallet://${WALLET_OUTCOME_BASEPATH}/v1/wallets/outcomes?outcome=${outcome}`
  );

export default {
  redirectWithOutcome,
  getFragments
};
