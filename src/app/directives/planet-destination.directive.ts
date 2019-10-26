import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPlanetDestination]'
})
export class PlanetDestinationDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input') oninput() {
    let formatted = (this.ngControl.value as string).replace(/[^0-6]/g, '');
    if (formatted.length === 0) { formatted = '0'; }
    this.ngControl.control.setValue(formatted);
  }

}
