import { Directive, ElementRef, Injector, HostListener } from '@angular/core';
import { NG_VALIDATORS, NgControl, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LIMITS } from '../models/constants';

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
    private element: ElementRef,
    private injector: Injector
  ) { }

  @HostListener('input') oninput() {
    const formatted = (<HTMLInputElement>this.element.nativeElement).value
      .toLocaleUpperCase().replace(/[^0-9A-F]/g, '');
    (<NgControl>this.injector.get(NgControl)).control.setValue(formatted);
  }

  validate(control: AbstractControl): ValidationErrors {
    return portalAddressValidator(control);
  }

}

export const portalAddressValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;
  if (!value) { return {invalidPortalAddress: true}; }

  const match = value.match(/([0-9A-F]{1})([0-9A-F]{3})([0-9A-F]{2})([0-9A-F]{3})([0-9A-F]{3})/);
  if (!match) { return {invalidPortalAddress: true}; }

  const [_match, portalId, systemId, yCoord, zCoord, xCoord] = match;
  const errors: ValidationErrors = {};

  if (value && _match) {
    const p = parseInt(portalId, 16);
    if (p < LIMITS.p.min || p > LIMITS.p.max) {
      errors.portalIdOutOfRange = portalId;
    }
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
  } else {
    errors.invalidPortalAddress = true;
  }

  return Object.keys(errors).length === 0 ? null : errors;
};
