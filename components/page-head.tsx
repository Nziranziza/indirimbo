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

  if (!isFocused) return null;

  const rawUrl = `${BASE_URL}${canonicalPath}`;
  const canonicalUrl = rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`;
  const ogImage = playlist === 'cantiques-kirundi' ? OG_IMAGE_KIRUNDI : OG_IMAGE;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
