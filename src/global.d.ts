/** Build class defined in the external NPG SDK library */
declare const Build: any;

interface Window {
  /**
   * Set to true by the SDK loader in src/npgsdk.js once the NPG SDK script has
   * finished loading and passed its SRI check. Paired with the `npg-sdk-ready`
   * event dispatched on `window`, for consumers that mount while the SDK is
   * still loading.
   */
  npgSdkReady?: boolean;
}
