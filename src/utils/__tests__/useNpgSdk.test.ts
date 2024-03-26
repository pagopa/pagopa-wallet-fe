import { renderHook } from "@testing-library/react";
import { useNpgSdk } from "../../hooks/useNpgSdk";

describe("useNpgSdk", () => {
  test("Should call onBuildError on sdk not ready", () => {
    const { result } = renderHook(() => useNpgSdk());
    expect(result.current.sdkReady).toBeFalsy();
    const onBuildError = jest.fn();
    expect(() => result.current.buildSdk({ onBuildError })).toThrow();
  });
});
