import { Component, OnInit } from '@angular/core';
import { CoordinatesService } from '../../services/coordinates.service';

@Component({
  selector: 'app-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.scss']
})
export class CoordinatesComponent implements OnInit {

  address: string;
  glyphs: string;

  constructor(private coordinatesService: CoordinatesService) {
    this.address = '';
    this.glyphs = '';
  }

  onInputGalacticAddress(newAddress: string, valid: boolean): void {
    if (valid) {
      this.glyphs = this.coordinatesService.convertGalacticAddress(newAddress);
    } else {
      this.glyphs = '';
    }
  }

  onInputPortalAddress(newAddress: string, valid: boolean): void {
    if (valid) {
      this.address = this.coordinatesService.convertPortalAddress(newAddress);
    } else {
      this.address = '';
    }
  }

  ngOnInit() {
  }

  get diagnostic() { return JSON.stringify({a: this.address, g: this.glyphs}); }

}
