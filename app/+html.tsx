import { LANGUAGE_PREFERENCE_KEY } from '@/constants/storage-keys';
import { ScrollViewStyleReset } from 'expo-router/html';

const restoreLangScript = `(function(){try{var v=localStorage.getItem('${LANGUAGE_PREFERENCE_KEY}');if(v==='fr'||v==='en'){document.documentElement.lang=v;}}catch(e){}})();`;

// Remove the browser's default blue focus ring on text inputs (e.g. the search bar);
// the input's own styling already conveys focus.
const focusResetStyle = `input:focus,textarea:focus{outline:none;}`;

// Microsoft Clarity — web-only session analytics. Gated off in dev by default
// (like Aptabase in utils/analytics.web.ts) so local sessions aren't recorded;
// set EXPO_PUBLIC_ENABLE_ANALYTICS_IN_DEV=true to opt in.
const CLARITY_PROJECT_ID = 'xj6ux8ywhp';
const isAnalyticsEnabled =
  !__DEV__ || process.env.EXPO_PUBLIC_ENABLE_ANALYTICS_IN_DEV === 'true';
// Load Clarity 2s after the page `load` event rather than during boot, so its
// script fetch and event listeners don't compete for the main thread while the
// app hydrates and the user's first interactions land (INP). Its Performance
// observers use buffered entries, so deferring doesn't lose the initial LCP.
const clarityScript = `(function(){function loadClarity(){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");}function start(){setTimeout(loadClarity,2000);}if(document.readyState==="complete"){start();}else{window.addEventListener("load",start);}})();`;

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

        {isAnalyticsEnabled && (
          <link rel="dns-prefetch" href="https://www.clarity.ms" />
        )}

        <script dangerouslySetInnerHTML={{ __html: restoreLangScript }} />
        {isAnalyticsEnabled && (
          <script dangerouslySetInnerHTML={{ __html: clarityScript }} />
        )}
        <style dangerouslySetInnerHTML={{ __html: focusResetStyle }} />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
