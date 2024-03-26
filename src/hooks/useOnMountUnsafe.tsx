import type { EffectCallback } from "react";
import { useEffect, useRef } from "react";

export function useOnMountUnsafe(effect: EffectCallback) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // eslint-disable-next-line functional/immutable-data
      initialized.current = true;
      effect();
    }
  }, []);
}
