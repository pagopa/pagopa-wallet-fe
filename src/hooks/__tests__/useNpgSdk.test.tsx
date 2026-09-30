/* eslint-disable functional/immutable-data */
/**
 * Tests for the two-mode NPG SDK loader in useNpgSdk.
 *
 * SRI mode (integrity URL set): fetch the hash, load with `integrity` +
 * `crossorigin="anonymous"`, fail closed on any error (no script, `sdkReady`
 * false, `buildSdk` a noop). Legacy mode (integrity URL empty or absent): load
 * the SDK without integrity and never fetch.
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { useNpgSdk } from "../useNpgSdk";

const SDK_URL = "http://localhost/sdk";
const INTEGRITY_URL = "http://localhost/sdk.integrity.json";

jest.mock("../../utils/buildConfig", () => ({
  __esModule: true,
  default: jest.fn()
}));

// eslint-disable-next-line functional/no-let
let mockIntegrityUrl: string | undefined = INTEGRITY_URL;

// Overrides the jest.setup.js config mock so each test can pick the loader mode.
jest.mock("../../config", () => ({
  getConfigOrThrow: () => ({
    WALLET_NPG_SDK_URL: SDK_URL,
    WALLET_NPG_SDK_INTEGRITY_URL: mockIntegrityUrl
  })
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
    mockIntegrityUrl = INTEGRITY_URL;
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

  it.each([
    ["an empty string", ""],
    ["not configured at all", undefined]
  ])(
    "loads the SDK without integrity when the integrity URL is %s",
    async (_label, integrityUrl) => {
      mockIntegrityUrl = integrityUrl;
      (global as any).fetch = jest.fn();

      const { result } = renderUseNpgSdk();

      await waitFor(() => expect(getNpgScript()).not.toBeNull());
      const script = getNpgScript();
      expect(script?.hasAttribute("integrity")).toBe(false);
      expect(script?.hasAttribute("crossorigin")).toBe(false);
      expect((global as any).fetch).not.toHaveBeenCalled();

      act(() => {
        script?.dispatchEvent(new Event("load"));
      });

      expect(result.current.sdkReady).toBe(true);
    }
  );
});
