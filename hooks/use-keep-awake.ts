import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useRef } from 'react';

const KEEP_AWAKE_TAG = 'song-screen';
const MS_PER_LINE = 3500;
const BUFFER_MS = 60_000;
const MIN_DURATION_MS = 2 * 60_000;
const MAX_DURATION_MS = 5 * 60_000;

export function useKeepAwake(lineCount: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isActiveRef = useRef(false);

  const estimatedDuration = Math.min(
    Math.max(lineCount * MS_PER_LINE + BUFFER_MS, MIN_DURATION_MS),
    MAX_DURATION_MS,
  );

  const safeDeactivate = useCallback(() => {
    if (!isActiveRef.current) return;
    isActiveRef.current = false;
    // Best-effort: a missing/denied wake lock is an expected browser
    // condition (e.g. web Wake Lock API), not an app error worth surfacing.
    deactivateKeepAwake(KEEP_AWAKE_TAG).catch((error) => {
      if (__DEV__) console.error(error);
    });
  }, []);

  const resetKeepAwake = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isActiveRef.current = true;
    // On web the Screen Wake Lock request can be denied (no user gesture,
    // page not visible, permissions policy) — swallow it silently in prod.
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch((error) => {
      isActiveRef.current = false;
      if (__DEV__) console.error(error);
    });
    timerRef.current = setTimeout(safeDeactivate, estimatedDuration);
  }, [estimatedDuration, safeDeactivate]);

  useEffect(() => {
    resetKeepAwake();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      safeDeactivate();
    };
  }, [resetKeepAwake, safeDeactivate]);

  return { resetKeepAwake };
}
