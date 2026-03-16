import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useRef } from 'react';

const KEEP_AWAKE_TAG = 'song-screen';
const MS_PER_LINE = 3500;
const BUFFER_MS = 60_000;
const MIN_DURATION_MS = 2 * 60_000;
const MAX_DURATION_MS = 5 * 60_000;

export function useKeepAwake(lineCount: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const estimatedDuration = Math.min(
    Math.max(lineCount * MS_PER_LINE + BUFFER_MS, MIN_DURATION_MS),
    MAX_DURATION_MS,
  );

  const resetKeepAwake = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(console.error);
    timerRef.current = setTimeout(() => {
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    }, estimatedDuration);
  }, [estimatedDuration]);

  useEffect(() => {
    resetKeepAwake();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    };
  }, [resetKeepAwake]);

  return { resetKeepAwake };
}
