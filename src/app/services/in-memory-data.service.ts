import { ATLAS } from '@data/atlas.data';
import { GEK } from '@data/gek.data';
import { KORVAX } from '@data/korvax.data';
import { VYKEEN } from '@data/vykeen.data';
import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    return {
      gek: GEK,
      korvax: KORVAX,
      vykeen: VYKEEN,
      atlas: ATLAS
    };
  }

}
