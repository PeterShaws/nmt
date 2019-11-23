import { Directive, HostListener, Injector, Type } from '@angular/core';
import { AbstractControl, NgControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

import { dec2hex, hex2dec, isOutsideLimits } from '@helpers/js.helper';
import { LIMITS } from '@models/limits.model';

@Directive({
  selector: '[nmtPortalAddress]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PortalAddressDirective,
    multi: true
  }]
})
export class PortalAddressDirective implements Validator {

  constructor(private injector: Injector) { }

  @HostListener('input') onInput() {
    const ngControl = this.injector.get(NgControl as Type<NgControl>);
    const formatted = (ngControl.value as string)
      .toUpperCase().replace(/[^0-9A-F]/g, '');
    ngControl.control.setValue(formatted);
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.portalAddressValidator(control);
  }

  private portalAddressValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    let match: RegExpMatchArray;
    const errors: ValidationErrors = { invalidPortalAddress: false };

    if (!value || !(match = value.match(/([0-9A-F]{1})([0-9A-F]{3})([0-9A-F]{2})([0-9A-F]{3})([0-9A-F]{3})/))) {
      errors.invalidPortalAddress = true;
    } else {
      const [fullMatch, portalId, systemId, yCoord, zCoord, xCoord] = match.map((v, i) => !i ? (!!v ? 1 : 0) : hex2dec(v));

      if (value && fullMatch) {
        if (isOutsideLimits(portalId, [LIMITS.p.min, LIMITS.p.max])) { errors.portalIdOutOfRange = dec2hex(portalId); }
        if (isOutsideLimits(systemId, [LIMITS.s.min, LIMITS.s.max])) { errors.systemIdOutOfRange = dec2hex(systemId); }
        if (isOutsideLimits(xCoord, [LIMITS.x.min, LIMITS.x.max])) { errors.xCoordinateOutOfRange = dec2hex(xCoord); }
        if (isOutsideLimits(yCoord, [LIMITS.y.min, LIMITS.y.max])) { errors.yCoordinateOutOfRange = dec2hex(yCoord); }
        if (isOutsideLimits(zCoord, [LIMITS.z.min, LIMITS.z.max])) { errors.zCoordinateOutOfRange = dec2hex(zCoord); }

        if (Object.keys(errors).length > 1) {
          errors.invalidPortalAddress = true;
        }
      } else {
        errors.invalidPortalAddress = true;
      }
    }

    return errors.invalidPortalAddress ? errors : null;
  }

}
