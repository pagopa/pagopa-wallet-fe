/* eslint-disable functional/immutable-data */
/**
 * Tests for the NPG SDK SRI loader in useNpgSdk.
 *
 * The hook is the single place where the NPG SDK is injected: it fetches the
 * published integrity hash and loads the SDK with `integrity` +
 * `crossorigin="anonymous"`. Fail-closed: if the hash cannot be fetched or is
 * missing, the script is never appended, `sdkReady` stays false and `buildSdk`
 * stays a noop, so no payment can use an unvalidated SDK.
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { useNpgSdk } from "../useNpgSdk";

const SDK_URL = "http://localhost/sdk";
const INTEGRITY_URL = "http://localhost/sdk.integrity.json";

jest.mock("../../utils/buildConfig", () => ({
  __esModule: true,
  default: jest.fn()
}));

const getNpgScript = () =>
  Array.from(document.head.querySelectorAll("script")).find(
    (s) => s.getAttribute("src") === SDK_URL
  ) ?? null;

const renderUseNpgSdk = () =>
  renderHook(() => useNpgSdk({ onBuildError: jest.fn() }));

describe("useNpgSdk loader (SRI)", () => {
  // eslint-disable-next-line functional/no-let
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    document.head.innerHTML = "";
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (global as any).fetch;
  });

  it("loads the SDK with integrity + crossorigin when the hash is fetched", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ integrityHash: "sha384-abc123" })
    });

    renderUseNpgSdk();

    await waitFor(() => expect(getNpgScript()).not.toBeNull());
    const script = getNpgScript();
    expect((global as any).fetch).toHaveBeenCalledWith(INTEGRITY_URL);
    expect(script?.getAttribute("src")).toBe(SDK_URL);
    expect(script?.getAttribute("integrity")).toBe("sha384-abc123");
    expect(script?.getAttribute("crossorigin")).toBe("anonymous");
  });

  it("is not ready until the SDK script fires its load event", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ integrityHash: "sha384-abc123" })
    });

    const { result } = renderUseNpgSdk();

    await waitFor(() => expect(getNpgScript()).not.toBeNull());
    expect(result.current.sdkReady).toBe(false);
    expect(result.current.buildSdk()).toBeUndefined();

    act(() => {
      getNpgScript()?.dispatchEvent(new Event("load"));
    });

    expect(result.current.sdkReady).toBe(true);
  });

  it("does not load the SDK when the integrity endpoint returns a non-OK response", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({})
    });

    const { result } = renderUseNpgSdk();

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    expect(getNpgScript()).toBeNull();
    expect(result.current.sdkReady).toBe(false);
  });

  it("does not load the SDK when the integrity fetch rejects", async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new Error("network"));

    const { result } = renderUseNpgSdk();

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    expect(getNpgScript()).toBeNull();
    expect(result.current.sdkReady).toBe(false);
  });

  it("does not load the SDK when the integrity hash is missing from the response", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    const { result } = renderUseNpgSdk();

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    expect(getNpgScript()).toBeNull();
    expect(result.current.sdkReady).toBe(false);
  });

  it("stays not ready when the SDK script fails to load or fails SRI validation", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ integrityHash: "sha384-abc123" })
    });

    const { result } = renderUseNpgSdk();

    await waitFor(() => expect(getNpgScript()).not.toBeNull());
    act(() => {
      getNpgScript()?.dispatchEvent(new Event("error"));
    });

    expect(result.current.sdkReady).toBe(false);
    expect(result.current.buildSdk()).toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
