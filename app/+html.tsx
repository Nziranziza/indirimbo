import { LANGUAGE_PREFERENCE_KEY } from '@/constants/storage-keys';
import { ScrollViewStyleReset } from 'expo-router/html';

const restoreLangScript = `(function(){try{var v=localStorage.getItem('${LANGUAGE_PREFERENCE_KEY}');if(v==='fr'||v==='en'){document.documentElement.lang=v;}}catch(e){}})();`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="color-scheme" content="light dark" />

        <script dangerouslySetInnerHTML={{ __html: restoreLangScript }} />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
