import { Directive, HostListener, InjectionToken, Injector } from '@angular/core';
import { AbstractControl, NgControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { aOutsideBC } from '@helpers/js.helper';
import { LIMITS } from '@models/limits.model';

@Directive({
  selector: '[appPortalAddress]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PortalAddressDirective,
    multi: true
  }]
})
export class PortalAddressDirective implements Validator {

  constructor(
    private injector: Injector,
    private ngControl = new InjectionToken<NgControl>('NgControl')
  ) { }

  @HostListener('input') onInput() {
    const formatted = (this.injector.get(this.ngControl).value as string)
      .toUpperCase().replace(/[^0-9A-F]/g, '');
    this.injector.get(this.ngControl).control.setValue(formatted);
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
      const [fullMatch, portalId, systemId, yCoord, zCoord, xCoord] = match.map((v, i) => !i ? (!!v ? 1 : 0) : parseInt(v, 16));

      if (value && fullMatch) {
        if (aOutsideBC(portalId, LIMITS.p.min, LIMITS.p.max)) { errors.portalIdOutOfRange    = portalId; }
        if (aOutsideBC(systemId, LIMITS.s.min, LIMITS.s.max)) { errors.systemIdOutOfRange    = systemId; }
        if (aOutsideBC(xCoord,   LIMITS.x.min, LIMITS.x.max)) { errors.xCoordinateOutOfRange = xCoord; }
        if (aOutsideBC(yCoord,   LIMITS.y.min, LIMITS.y.max)) { errors.yCoordinateOutOfRange = yCoord; }
        if (aOutsideBC(zCoord,   LIMITS.z.min, LIMITS.z.max)) { errors.zCoordinateOutOfRange = zCoord; }

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
