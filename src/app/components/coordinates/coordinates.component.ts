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

  private formatAddress(address: string): string {
    let match = address
      .toUpperCase()
      .replace(/[^A-F0-9]/g, '')
      .match(new RegExp('.{1,4}', 'g'));
    let result: string;
    
    if (match !== null) {
      result = match.join(':');
    } else {
      result = '';
    }
    
    return result;
  }
  
  onChangeAddress(newAddress: string): void {
    let formatted = this.formatAddress(newAddress);
    this.address = formatted;
    this.glyphs = this.coordinatesService.convertAddress(formatted);
  }

  private formatGlyphs(glyphs: string): string {
    let result: string;
    
    result = glyphs
      .replace(/[^A-F0-9]/g, '')
      .replace(/^0+/, '');

    return result;
  }

  onChangeGlyphs(newGlyphs: string): void {
    this.glyphs = this.formatGlyphs(newGlyphs);
  }

  ngOnInit() {
  }

}
