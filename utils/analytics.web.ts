/**
 * Analytics facade (web). Session analytics on web run through Microsoft
 * Clarity, injected in app/+html.tsx; there is no event-level provider, so
 * `trackEvent` is a no-op and exists so call sites stay in place for whichever
 * provider comes next.
 */
export function initAnalytics(): void {
  // No provider to initialize.
}

export function trackEvent(
  _eventName: string,
  _properties?: Record<string, string | number>,
): void {
  // No provider to send to.
}

export async function trackAppUpdateIfChanged(): Promise<void> {
  // Web is always served the current deploy; no install version to compare.
}
