import { ThemedView } from '@/components/themed-view';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

export default function IndexRedirect() {
  const router = useRouter();
  const { isBurundi, hasCompletedOnboarding, isLoading } = useSongbookPreference();

  useFocusEffect(
    useCallback(() => {
      if (isLoading) return;

      if (isBurundi && !hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/(home)');
      }
    }, [isLoading, isBurundi, hasCompletedOnboarding, router])
  );

  return <ThemedView style={{ flex: 1 }} />;
}
