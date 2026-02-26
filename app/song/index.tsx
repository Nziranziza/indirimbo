import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Backward-compat redirect for old query-param song URLs:
 *   /song?playlist=gushimisha&songNumber=1  →  /song/gushimisha/1
 */
export default function SongRedirect() {
  const { playlist, songNumber } = useLocalSearchParams<{
    playlist: string;
    songNumber: string;
  }>();

  if (playlist && songNumber) {
    return <Redirect href={`/song/${playlist}/${songNumber}`} />;
  }

  // No params — go home
  return <Redirect href="/" />;
}
