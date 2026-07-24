/**
 * NPG SDK loader with Subresource Integrity (SRI) check.
 *
 * Self-hosted model: the NPG SDK is served from a pagoPA-controlled CDN (the
 * platform CDN), together with its integrity hash (published atomically by a
 * scheduled job). This loader fetches the published hash and loads the SDK with
 * the `integrity` attribute set, for PCI SAQ-A compliance. The SDK is served
 * cross-origin (platform CDN vs the wallet host), so the script is loaded with
 * `crossorigin="anonymous"`: the browser cannot validate SRI on a cross-origin
 * resource fetched without CORS.
 *
 * No permissive fallback: SDK and hash are aligned by construction, so a hash
 * mismatch should never happen in normal operation. If the hash cannot be
 * fetched or SRI validation fails, the SDK is intentionally NOT loaded without
 * integrity -> a payment must never proceed with an unvalidated SDK.
 *
 * Readiness contract: this is the single place where the SDK is injected. It is
 * included by src/index.html, so it runs on every page. Consumers that need to
 * know when the SDK is usable must NOT inject a second copy: they read
 * `window.npgSdkReady` and listen for the `npg-sdk-ready` event on `window`.
 * See src/hooks/useNpgSdk.ts.
 */

/** Keep in sync with the event name used in src/hooks/useNpgSdk.ts. */
const NPG_SDK_READY_EVENT = "npg-sdk-ready";

window.npgSdkReady = false;

const loadNpgSDK = async () => {
  const sdkUrl = window._env_.WALLET_NPG_SDK_URL;
  const integrityUrl = window._env_.WALLET_NPG_SDK_INTEGRITY_URL;

  try {
    const response = await fetch(integrityUrl);
    if (!response.ok) {
      throw new Error(`Integrity endpoint returned HTTP ${response.status}`);
    }
    const { integrityHash } = await response.json();
    if (!integrityHash) {
      throw new Error("Integrity hash missing from response");
    }

    const script = document.createElement("script");
    script.setAttribute("src", sdkUrl);
    script.setAttribute("type", "text/javascript");
    script.setAttribute("charset", "UTF-8");
    script.setAttribute("integrity", integrityHash);
    // Cross-origin load from the platform CDN: SRI can only be validated with CORS.
    script.setAttribute("crossorigin", "anonymous");
    // Readiness signal for consumers that mount after (or before) the SDK is loaded.
    script.addEventListener("load", () => {
      window.npgSdkReady = true;
      window.dispatchEvent(new Event(NPG_SDK_READY_EVENT));
    });
    // SRI validation failure or load error: the SDK simply stays unloaded so no payment can use it.
    script.onerror = () => {
      console.error(
        "NPG SDK failed to load or failed SRI validation; SDK not loaded"
      );
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error("Failed to load NPG SDK with integrity:", error);
  }
};

loadNpgSDK();
