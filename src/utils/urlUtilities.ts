import { getConfigOrThrow } from "../config";

const API_HOST = getConfigOrThrow().WALLET_CONFIG_API_HOST;
const API_PM_BASEPATH = getConfigOrThrow().WALLET_CONFIG_API_PM_BASEPATH;

/**
 * This function requires a valid URI with a querystrings as the fragment URI
 * example: http://dev.checkout.it/gdi-check#param1=value1&param2=value2.
 * The function return an empty string if the uri parameter is not valid
 * or the parameter can't be found
 */
export function getFragmentParameter(uri: string, name: string): string {
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
 * This function executes a window.locatio.replace on a particular url with a numeric outcome
 * from the outcome parameter. The IO APP will use the url and the outcome to give a feddback to the user
 */
const redirectWithOutcame = (outcome: number) =>
  window.location.replace(
    `${API_HOST}${API_PM_BASEPATH}/v3/webview/logout/bye?outcome=${outcome}`
  );

export default {
  getFragmentParameter,
  redirectWithOutcame
};
