export interface SongReference {
  readonly title?: string;
  readonly codes?: string;
}

export interface Song {
  readonly number: number | string;
  readonly name: string;
  readonly url: string;
  readonly key?: string;
  readonly category?: string;
  readonly subcategory?: string;
  readonly origin?: string;
  readonly bibleRef?: string;
  readonly sharedMelody?: readonly (number | string)[];
  readonly references?: readonly SongReference[];
  readonly body: readonly {
    readonly type: 'verse' | 'chorus';
    readonly number?: number;
    readonly content: string;
  }[];
}
