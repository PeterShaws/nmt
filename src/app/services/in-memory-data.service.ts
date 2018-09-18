import { InMemoryDbService } from 'angular-in-memory-web-api';

import { GEK } from '../../data/gek';
import { KORVAX } from '../../data/korvax';
import { VYKEEN } from '../../data/vykeen';
import { ATLAS } from '../../data/atlas';

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
