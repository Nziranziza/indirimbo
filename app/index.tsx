import { ThemedView } from '@/components/themed-view';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function IndexRedirect() {
  const router = useRouter();
  const { isBurundi, hasCompletedOnboarding, isLoading } = useSongbookPreference();

  useEffect(() => {
    if (isLoading) return;

    if (isBurundi && !hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else {
      router.replace('/(tabs)/(home)');
    }
  }, [isLoading, isBurundi, hasCompletedOnboarding, router]);

  return <ThemedView style={{ flex: 1 }} />;
}
