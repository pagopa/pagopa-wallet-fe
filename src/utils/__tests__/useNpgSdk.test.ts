import { renderHook } from "@testing-library/react";
import { useNpgSdk } from "../../hooks/useNpgSdk";

describe("useNpgSdk", () => {
  test("Should call onBuildError on sdk not ready", () => {
    const { result } = renderHook(() => useNpgSdk());
    expect(result.current.sdkReady).toBeFalsy();
    // eslint-disable-next-line functional/no-let
    let error = false;
    result.current.buildSdk({ onBuildError: () => (error = true) });
    expect(error).toBeTruthy();
  });
});
