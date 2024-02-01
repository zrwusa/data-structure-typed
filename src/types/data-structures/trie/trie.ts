import { IterableElementBaseOptions } from '../base';

export type TrieOptions<R> = { caseSensitive?: boolean } & IterableElementBaseOptions<string, R>;
