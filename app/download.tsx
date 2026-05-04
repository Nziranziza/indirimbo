import { DownloadPageBody } from '@/components/download-page-body';
import { PageHead } from '@/components/page-head';
import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

export default function DownloadScreen() {
  if (Platform.OS !== 'web') {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return (
    <>
      <PageHead
        title="Download Indirimbo - Rwandan Hymns App"
        description="Download Indirimbo for iOS and Android. Browse Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Free on the App Store and Google Play."
        canonicalPath="/download"
        keywords="indirimbo download, indirimbo app, rwandan hymns app, agakiza app, gushimisha app, kinyarwanda worship songs"
      />
      <DownloadPageBody variant="default" />
    </>
  );
}
