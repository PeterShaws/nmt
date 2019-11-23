import { Component } from '@angular/core';
import { CoordinatesService } from '@services/coordinates.service';

@Component({
  selector: 'nmt-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.scss']
})
export class CoordinatesComponent {

  address = '';
  glyphs = '';
  planet = '';

  constructor(private coordinatesService: CoordinatesService) { }

  onInputGalacticAddress(
    newAddress: string,
    validAddress: boolean,
    newDestination: string,
    validDestination: boolean
  ): void {
    if (validAddress) {
      this.glyphs = this.coordinatesService.convertGalacticAddress(
        newAddress,
        validDestination ? newDestination : undefined
      );
      this.planet = this.glyphs.slice(0, 1);
    } else {
      this.glyphs = '';
    }
  }

  onInputPortalAddress(newAddress: string, valid: boolean): void {
    if (valid) {
      this.address = this.coordinatesService.convertPortalAddress(newAddress);
      this.planet = newAddress.slice(0, 1);
    } else {
      this.address = '';
    }
  }

  onInputPlanetDestination(newPlanet: string, validPlanet: boolean, allValid: boolean): void {
    if (!validPlanet) { this.planet = newPlanet = '0'; }
    if (allValid) {
      this.glyphs = `${newPlanet}${this.glyphs.slice(1)}`;
    }
  }

}
