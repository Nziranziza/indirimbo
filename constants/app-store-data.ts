/**
 * App Store / Google Play listing data for SoftwareApplication structured data.
 *
 * Keep the rating values, counts, and featured reviews in sync with the live
 * store listings. Google requires the rating in JSON-LD to reflect a genuine,
 * page-visible rating — update these numbers when the store ratings change.
 */

import { APP_STORE_URL, PLAY_STORE_URL } from './app-links';

export interface AppReview {
  readonly author: string;
  readonly title?: string;
  readonly body: string;
  readonly rating: number;
  readonly datePublished: string; // ISO 8601 (YYYY-MM-DD)
}

export interface AppStoreListing {
  readonly store: 'App Store' | 'Google Play';
  readonly operatingSystem: string;
  readonly developer: string;
  readonly url: string;
  readonly ratingValue: number;
  readonly ratingCount: number;
  readonly reviews: readonly AppReview[];
}

export const APP_NAME = 'Indirimbo';
export const APP_CATEGORY = 'LifestyleApplication';
export const APP_CONTENT_RATING = '4+';

export const APP_STORE_LISTINGS: readonly AppStoreListing[] = [
  {
    store: 'App Store',
    operatingSystem: 'IOS',
    developer: 'Daniel Nziranziza',
    url: APP_STORE_URL ?? '',
    ratingValue: 5.0,
    ratingCount: 6,
    reviews: [
      {
        author: 'turabawe',
        title: 'Impressive',
        body: "This is the only hymn book app I was able to find on the App Store. I rated it 5 stars because of the dark and light mode features, which complement the iPhone features as well. I also found it very useful to be able to search for a song in the search bar by number or song title. One other feature I've enjoyed using is the option to add songs to a favorite library. I'm making the most out of it so far. It's worth giving a try.",
        rating: 5,
        datePublished: '2026-04-01',
      },
    ],
  },
  {
    store: 'Google Play',
    operatingSystem: 'ANDROID',
    developer: 'Nziranziza',
    url: PLAY_STORE_URL ?? '',
    ratingValue: 4.8,
    ratingCount: 9,
    reviews: [
      {
        author: 'Jean Pierre Baraka Uwimana',
        body: "This is the app I needed. It's simple, easy to use, well organised, doesn't contain ads, has clean interface and, most importantly, fast. Plus, the search functionality is very fast and accurate. It's the best cantique app I've used so far.",
        rating: 5,
        datePublished: '2026-04-03',
      },
    ],
  },
];
