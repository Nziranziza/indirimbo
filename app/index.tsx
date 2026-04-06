import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { Redirect } from 'expo-router';

export default function IndexRedirect() {
  const { isBurundi, hasCompletedOnboarding, isLoading } = useSongbookPreference();

  if (isLoading) {
    return null;
  }

  if (isBurundi && !hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/(home)" withAnchor />;
}
