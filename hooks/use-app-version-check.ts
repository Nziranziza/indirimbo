import Constants from 'expo-constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';

import { trackEvent } from '@/utils/analytics';
import {
  getUpdateSkipAcknowledged,
  setUpdateSkipAcknowledged,
} from '@/utils/storage';

const VERSION_MANIFEST_URL =
  process.env.EXPO_PUBLIC_VERSION_MANIFEST_URL ?? 'https://indirimbo.rw/version.json';
const FETCH_TIMEOUT_MS = 5000;
const MIN_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export type UpdateMode =
  | 'none'
  | 'modal-required'
  | 'modal-available'
  | 'banner-available';

export interface UpdateCheckResult {
  readonly mode: UpdateMode;
  readonly acknowledgeSkip: () => void;
}

interface PlatformFloor {
  readonly minRequiredVersion?: string;
  readonly latestVersion?: string;
}

interface VersionManifest {
  readonly ios?: PlatformFloor;
  readonly android?: PlatformFloor;
}

function isVersionString(value: unknown): value is string {
  return typeof value === 'string' && /^\d+(\.\d+){0,3}$/.test(value);
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map((n) => parseInt(n, 10) || 0);
  const partsB = b.split('.').map((n) => parseInt(n, 10) || 0);
  const length = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < length; i++) {
    const ai = partsA[i] ?? 0;
    const bi = partsB[i] ?? 0;
    if (ai < bi) return -1;
    if (ai > bi) return 1;
  }
  return 0;
}

async function fetchManifest(): Promise<VersionManifest | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${VERSION_MANIFEST_URL}?t=${Date.now()}`, {
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return (await response.json()) as VersionManifest;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useAppVersionCheck(): UpdateCheckResult {
  const [mode, setMode] = useState<UpdateMode>('none');
  const latestVersionRef = useRef<string | null>(null);
  const installedVersionRef = useRef<string | null>(null);
  const lastCheckedAtRef = useRef<number>(0);
  const trackedPromptKeyRef = useRef<string | null>(null);

  const trackPromptShown = useCallback((variant: UpdateMode, latest: string | null, installed: string) => {
    if (variant === 'none') return;
    const key = `${variant}:${latest ?? ''}`;
    if (trackedPromptKeyRef.current === key) return;
    trackedPromptKeyRef.current = key;
    trackEvent('update_prompt_shown', {
      variant,
      installed_version: installed,
      latest_version: latest ?? '',
    });
  }, []);

  const check = useCallback(async () => {
    if (Platform.OS === 'web') return;

    const installedVersion = Constants.expoConfig?.version;
    if (!isVersionString(installedVersion)) return;
    installedVersionRef.current = installedVersion;

    const manifest = await fetchManifest();
    if (!manifest) return;

    const platformFloor = Platform.OS === 'ios' ? manifest.ios : manifest.android;
    const minVersion = platformFloor?.minRequiredVersion;
    const latestVersion = platformFloor?.latestVersion;

    if (isVersionString(minVersion) && compareVersions(installedVersion, minVersion) < 0) {
      latestVersionRef.current = isVersionString(latestVersion) ? latestVersion : null;
      setMode('modal-required');
      trackPromptShown('modal-required', latestVersionRef.current, installedVersion);
      return;
    }

    if (isVersionString(latestVersion) && compareVersions(installedVersion, latestVersion) < 0) {
      latestVersionRef.current = latestVersion;
      const skipped = await getUpdateSkipAcknowledged();
      const nextMode: UpdateMode = skipped === latestVersion ? 'banner-available' : 'modal-available';
      setMode(nextMode);
      trackPromptShown(nextMode, latestVersion, installedVersion);
      return;
    }

    latestVersionRef.current = null;
    setMode('none');
  }, [trackPromptShown]);

  const acknowledgeSkip = useCallback(() => {
    const version = latestVersionRef.current;
    if (!version) return;
    void setUpdateSkipAcknowledged(version);
    trackEvent('update_skip', {
      installed_version: installedVersionRef.current ?? '',
      latest_version: version,
    });
    setMode('banner-available');
  }, []);

  useEffect(() => {
    const runCheckIfDue = () => {
      const now = Date.now();
      if (now - lastCheckedAtRef.current < MIN_CHECK_INTERVAL_MS) return;
      lastCheckedAtRef.current = now;
      void check();
    };

    runCheckIfDue();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') runCheckIfDue();
    });
    return () => subscription.remove();
  }, [check]);

  return useMemo(() => ({ mode, acknowledgeSkip }), [mode, acknowledgeSkip]);
}
