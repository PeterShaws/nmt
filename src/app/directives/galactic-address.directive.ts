import { Directive, HostListener, Injector, Type } from '@angular/core';
import { AbstractControl, NgControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

import { dec2hex, hex2dec, isOutsideLimits } from '@helpers/js.helper';
import { LIMITS } from '@models/limits.model';

@Directive({
  selector: '[nmtGalacticAddress]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: GalacticAddressDirective,
    multi: true
  }]
})
export class GalacticAddressDirective implements Validator {

  constructor(private injector: Injector) { }

  @HostListener('input') onInput() {
    const ngControl = this.injector.get(NgControl as Type<NgControl>);

    let formatted = (ngControl.value as string)
      .toUpperCase().replace(/[^0-9A-F]/g, '');
    const matches = formatted.match(/.{1,4}/g);
    formatted = matches ? matches.join(':') : '';
    ngControl.control.setValue(formatted);
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.galacticAddressValidator(control);
  }

  private galacticAddressValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    let match: RegExpMatchArray;
    const errors: ValidationErrors = { invalidGalacticAddress: false };

    if (!value || !(match = value.match(/([0-9A-F]{4}):([0-9A-F]{4}):([0-9A-F]{4}):([0-9A-F]{4})/))) {
      errors.invalidGalacticAddress = true;
    } else {
      const [fullMatch, xCoord, yCoord, zCoord, systemId] = match.map((v, i) => !i ? (!!v ? 1 : 0) : hex2dec(v));

      if (value && fullMatch) {
        if (isOutsideLimits(systemId, [LIMITS.s.min, LIMITS.s.max])) { errors.systemIdOutOfRange = dec2hex(systemId); }
        if (isOutsideLimits(xCoord, [LIMITS.x.min, LIMITS.x.max])) { errors.xCoordinateOutOfRange = dec2hex(xCoord); }
        if (isOutsideLimits(yCoord, [LIMITS.y.min, LIMITS.y.max])) { errors.yCoordinateOutOfRange = dec2hex(yCoord); }
        if (isOutsideLimits(zCoord, [LIMITS.z.min, LIMITS.z.max])) { errors.zCoordinateOutOfRange = dec2hex(zCoord); }

        if (Object.keys(errors).length > 1) {
          errors.invalidGalacticAddress = true;
        }
      } else {
        errors.invalidGalacticAddress = true;
      }
    }

    return errors.invalidGalacticAddress ? errors : null;
  }

}
