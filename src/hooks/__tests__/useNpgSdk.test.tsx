/* eslint-disable functional/immutable-data */
/**
 * Tests for the readiness contract of useNpgSdk.
 *
 * The hook must NOT load the NPG SDK: the SDK is injected exactly once, with
 * its SRI check, by the standalone loader in src/npgsdk.js. The hook only
 * observes readiness, via the `npg-sdk-ready` event when the SDK is still
 * loading and via `window.npgSdkReady` when it already finished loading.
 */
import { act, renderHook } from "@testing-library/react";
import { useNpgSdk } from "../useNpgSdk";

const NPG_SDK_READY_EVENT = "npg-sdk-ready";

const renderUseNpgSdk = () =>
  renderHook(() => useNpgSdk({ onBuildError: jest.fn() }));

describe("useNpgSdk readiness", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    delete (window as any).npgSdkReady;
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it("never injects the SDK and never fetches the integrity hash", () => {
    (global as any).fetch = jest.fn();

    renderUseNpgSdk();

    expect(document.head.querySelector("script")).toBeNull();
    expect((global as any).fetch).not.toHaveBeenCalled();
  });

  it("is not ready until the loader signals readiness", () => {
    const { result } = renderUseNpgSdk();

    expect(result.current.sdkReady).toBe(false);
    expect(result.current.buildSdk()).toBeUndefined();
  });

  it("becomes ready when the loader dispatches the ready event after mount", () => {
    const { result } = renderUseNpgSdk();
    expect(result.current.sdkReady).toBe(false);

    act(() => {
      window.dispatchEvent(new Event(NPG_SDK_READY_EVENT));
    });

    expect(result.current.sdkReady).toBe(true);
  });

  /**
   * Regression test for the double load fixed in PIDM-2228: the SDK is loaded
   * by the standalone loader early in the page life cycle, so on a route that
   * mounts later it is usually ALREADY loaded. A readiness check based only on
   * the load event of an existing script would never fire here, leaving the GDI
   * check stuck until its timeout.
   */
  it("is ready immediately when the SDK was already loaded before mount", () => {
    (window as any).npgSdkReady = true;

    const { result } = renderUseNpgSdk();

    expect(result.current.sdkReady).toBe(true);
  });

  it("stops listening for readiness once unmounted", () => {
    const { result, unmount } = renderUseNpgSdk();

    unmount();
    act(() => {
      window.dispatchEvent(new Event(NPG_SDK_READY_EVENT));
    });

    expect(result.current.sdkReady).toBe(false);
  });
});
