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

  onInputAddress(newAddress: string, valid: boolean): void {
    if (valid) {
      this.glyphs = this.coordinatesService.convertAddress(newAddress);
    }
  }
  
  ngOnInit() {
  }

}
