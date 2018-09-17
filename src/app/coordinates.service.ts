import { Injectable } from '@angular/core';

const MIN_X = 0x0; const MAX_X = 0xFFF; const LEN_X = 3;
const MIN_Y = 0x0; const MAX_Y = 0xFF;  const LEN_Y = 2;
const MIN_Z = 0x0; const MAX_Z = 0xFFF; const LEN_Z = 3;
const MIN_S = 0x1; const MAX_S = 0x2FF; const LEN_S = 3;
const MIN_P = 0x0; const MAX_P = 0x6;   const LEN_P = 1;

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  constructor() { }

  /**
   * Normalizes a given coordinate string, clamping it between a minimum (provided or `0x0`) and a
   * maximum (provided or `0xFFF`), and also optionally setting the length of the resulting string.
   * 
   * @param {string} coordinate The coordinate string to be normalized.
   * @param {number} [min=MIN_X] The lower bound for the normalized coordinate (optional: `0x0` by
   * default).
   * @param {number} [max=MAX_X] The upper bound for the normalized coordinate (optional: `0xFFF`
   * by default).
   * @param {boolean} [translate=false] Whether to translate the coordinate around the center of the
   * interval; useful to go from galactic address to portal glyphs (optional: `false` by default).
   * @param {number} [length] The intended length of the resulting string; the result will be
   * padded with zeroes to the left if its length is smaller than this value, or sliced to its
   * `length` last digits if greater.
   * @returns {string} The normalized coordinate string.
   */
  private normalizeCoordinate(coordinate: string, min: number = MIN_X, max: number = MAX_X, translate: boolean = false, length?: number): string {
    let normalized = parseInt(coordinate, 16);

    if (isNaN(normalized)) { normalized = 0; }

    if (normalized < min) {
      normalized = min;
    } else if (normalized > max) {
      normalized = max;
    }

    if (translate) {
      normalized += (Math.floor(max / 2) + 2);
      normalized %= (max + 1);
    }

    let result = normalized.toString(16).toUpperCase();

    if (length && !isNaN(length) && length > 0) {
      if (result.length > length) {
        result = result.slice(-length);
      } else if (result.length < length) {
        result = result.padStart(length, '0');
      }
    }

    return result;
  }

  /**
   * Converts a galactic address into the corresponding portal glyph sequence.
   * 
   * @param {string} address The string of signal booster coordinates to be converted.
   * @param {string} [portalId=`${MIN_P}`] The ID of the portal within the target system, limited to
   * `1..6` (optional: `'1'` by default).
   * @returns {string} The converted portal address.
   */
  convertAddress(address: string, portalId: string = MIN_P.toString(16)): string {
    let [xCoord, yCoord, zCoord, systemId] = address.split(':');
    
    xCoord   = this.normalizeCoordinate(xCoord,   MIN_X, MAX_X, true,  LEN_X);
    yCoord   = this.normalizeCoordinate(yCoord,   MIN_Y, MAX_Y, true,  LEN_Y);
    zCoord   = this.normalizeCoordinate(zCoord,   MIN_Z, MAX_Z, true,  LEN_Z);
    systemId = this.normalizeCoordinate(systemId, MIN_S, MAX_S, false, LEN_S);
    portalId = this.normalizeCoordinate(portalId, MIN_P, MAX_P, false, LEN_P);
    
    return portalId + systemId + yCoord + zCoord + xCoord;
  }

  convertGlyphs(glyphs: string): string {
    return '';
  }

}
