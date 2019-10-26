import { Entry } from '@models/entry.model';

export interface Dictionary {
  'language': string;
  'entries': Entry[];
}
