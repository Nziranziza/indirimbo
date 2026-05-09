import { useLanguage } from '@/contexts/language-context';
import { useIsFocused } from '@react-navigation/native';
import Head from 'expo-router/head';

const BASE_URL = 'https://indirimbo.rw';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const OG_IMAGE_KIRUNDI = `${BASE_URL}/og-image-kirundi.jpg`;

interface PageHeadProps {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: string;
  readonly keywords?: string;
  readonly playlist?: string;
}

export function PageHead({ title, description, canonicalPath, keywords, playlist }: PageHeadProps) {
  const isFocused = useIsFocused();
  const { language } = useLanguage();

  if (!isFocused) return null;

  const rawUrl = `${BASE_URL}${canonicalPath}`;
  const canonicalUrl = rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`;
  const isKirundi = playlist === 'cantiques-kirundi';
  const ogImage = isKirundi ? OG_IMAGE_KIRUNDI : OG_IMAGE;
  // Song pages keep their content language; static pages reflect the active UI language.
  const ogLocale = playlist
    ? (isKirundi ? 'rn_BI' : 'rw_RW')
    : (language === 'fr' ? 'fr_FR' : 'en_US');

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={ogLocale} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
