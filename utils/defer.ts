import { Platform } from 'react-native';

type IdleWindow = {
  requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Runs `task` after the browser is idle (i.e. past first paint) on web, so
 * boot-time work doesn't compete with hydration and delay the first contentful
 * paint. On native there is no such contention, so it runs immediately.
 * Returns a cleanup that cancels the pending callback if it hasn't fired yet.
 */
export function runAfterPaint(task: () => void, timeout = 2000): () => void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    task();
    return () => {};
  }

  const idleWindow: IdleWindow = window;
  if (idleWindow.requestIdleCallback) {
    const id = idleWindow.requestIdleCallback(task, { timeout });
    return () => idleWindow.cancelIdleCallback?.(id);
  }

  const timer = setTimeout(task, 0);
  return () => clearTimeout(timer);
}
