import { Directive, HostListener, Injector, Type } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[nmtPlanetDestination]'
})
export class PlanetDestinationDirective {

  constructor(private injector: Injector) { }

  @HostListener('input') oninput() {
    const ngControl = this.injector.get(NgControl as Type<NgControl>);
    let formatted = (ngControl.value as string).replace(/[^0-6]/g, '');
    if (formatted.length === 0) { formatted = ''; }
    ngControl.control.setValue(formatted);
  }

}
