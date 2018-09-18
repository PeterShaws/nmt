import { ElementRef, Injector } from '@angular/core';

import { GalacticAddressDirective } from './galactic-address.directive';

describe('GalacticAddressDirective', () => {
  it('should create an instance', () => {
    const directive = new GalacticAddressDirective(new ElementRef({}), <Injector>{});
    expect(directive).toBeTruthy();
  });
});
