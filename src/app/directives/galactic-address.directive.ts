import { Directive, Injector, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, NgControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LIMITS } from '@models/limits.model';

@Directive({
  selector: '[appGalacticAddress]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: GalacticAddressDirective,
    multi: true
  }]
})
export class GalacticAddressDirective implements Validator {

  constructor(private injector: Injector) { }

  @HostListener('input') onInput() {
    let formatted = (<string>(<NgControl>this.injector.get(NgControl)).value)
      .toUpperCase().replace(/[^0-9A-F]/g, '');
    const matches = formatted.match(/.{1,4}/g);
    formatted = matches ? matches.join(':') : '';
    (<NgControl>this.injector.get(NgControl)).control.setValue(formatted);
  }

  validate(control: AbstractControl): ValidationErrors {
    return galacticAddressValidator(control);
  }

}

export const galacticAddressValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;
  let match: RegExpMatchArray;
  const errors: ValidationErrors = {invalidGalacticAddress: false};

  if (!value || !(match = value.match(/([0-9A-F]{4}):([0-9A-F]{4}):([0-9A-F]{4}):([0-9A-F]{4})/))) {
    errors.invalidGalacticAddress = true;
  } else {
    const [fullMatch, xCoord, yCoord, zCoord, systemId] = match;

    if (value && fullMatch) {
      const s = parseInt(systemId, 16);
      if (s < LIMITS.s.min || s > LIMITS.s.max) {
        errors.systemIdOutOfRange = systemId;
      }
      const x = parseInt(xCoord, 16);
      if (x < LIMITS.x.min || x > LIMITS.x.max) {
        errors.xCoordinateOutOfRange = xCoord;
      }
      const y = parseInt(yCoord, 16);
      if (y < LIMITS.y.min || y > LIMITS.y.max) {
        errors.yCoordinateOutOfRange = yCoord;
      }
      const z = parseInt(zCoord, 16);
      if (z < LIMITS.z.min || z > LIMITS.z.max) {
        errors.zCoordinateOutOfRange = zCoord;
      }

      if (Object.keys(errors).length > 1) {
        errors.invalidGalacticAddress = true;
      }
    } else {
      errors.invalidGalacticAddress = true;
    }
  }

  return errors.invalidGalacticAddress ? errors : null;
};
