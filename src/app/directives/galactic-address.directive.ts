import { Directive, ElementRef, Injector, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, NgControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appGalacticAddress]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: GalacticAddressDirective,
    multi: true
  }]
})
export class GalacticAddressDirective implements Validator {

  constructor(
    private element: ElementRef,
    private injector: Injector
  ) { }

  @HostListener('input') oninput() {
    let formatted = (<HTMLInputElement>this.element.nativeElement).value.toUpperCase();
    const matches = formatted.replace(/[^A-F0-9]/g, '').match(/.{1,4}/g);
    formatted = matches ? matches.join(':') : '';
    (<NgControl>this.injector.get(NgControl)).control.setValue(formatted);
  }

  validate(control: AbstractControl): ValidationErrors {
    return galacticAddressValidator(control);
  }

}

export const galacticAddressValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;

  return value && value.match(/([A-F0-9]{4}:){3}[A-F0-9]{4}/)
    ? null
    : { invalidGalacticAddress: true }
};
