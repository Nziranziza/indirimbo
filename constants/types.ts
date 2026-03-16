export interface Song {
  readonly number: number | string;
  readonly name: string;
  readonly url: string;
  readonly body: readonly {
    readonly type: 'verse' | 'chorus';
    readonly number?: number;
    readonly content: string;
  }[];
}
