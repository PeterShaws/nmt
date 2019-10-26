import { Directive, HostListener, Injector, Type } from '@angular/core';
import { AbstractControl, NgControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { aOutsideBC } from '@helpers/js.helper';
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
    let formatted = (this.injector.get(NgControl as Type<NgControl>).value as string)
      .toUpperCase().replace(/[^0-9A-F]/g, '');
    const matches = formatted.match(/.{1,4}/g);
    formatted = matches ? matches.join(':') : '';
    this.injector.get(NgControl as Type<NgControl>).control.setValue(formatted);
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
      const [fullMatch, xCoord, yCoord, zCoord, systemId] = match.map((v, i) => !i ? (!!v ? 1 : 0) : parseInt(v, 16));

      if (value && fullMatch) {
        if (aOutsideBC(systemId, LIMITS.s.min, LIMITS.s.max)) { errors.systemIdOutOfRange    = systemId; }
        if (aOutsideBC(xCoord,   LIMITS.x.min, LIMITS.x.max)) { errors.xCoordinateOutOfRange = xCoord; }
        if (aOutsideBC(yCoord,   LIMITS.y.min, LIMITS.y.max)) { errors.yCoordinateOutOfRange = yCoord; }
        if (aOutsideBC(zCoord,   LIMITS.z.min, LIMITS.z.max)) { errors.zCoordinateOutOfRange = zCoord; }

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
