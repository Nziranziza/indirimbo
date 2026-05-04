import { DownloadPageBody } from '@/components/download-page-body';
import { PageHead } from '@/components/page-head';
import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

export default function DownloadKirundiScreen() {
  if (Platform.OS !== 'web') {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return (
    <>
      <PageHead
        title="Download Indirimbo - Cantiques Kirundi & Kinyarwanda App"
        description="Download Indirimbo for iOS and Android. Browse Cantiques Kirundi alongside Gushimisha Imana and Agakiza hymnbooks. Free on the App Store and Google Play."
        canonicalPath="/download-kirundi"
        keywords="indirimbo download, cantiques kirundi app, burundian hymns app, indirimbo zo guhimbaza imana, kirundi worship songs"
      />
      <DownloadPageBody variant="kirundi" />
    </>
  );
}
