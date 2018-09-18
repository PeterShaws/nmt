import { Injectable } from '@angular/core';

import { LIMITS } from '../models/constants';

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
   * @param {number} [min=LIMITS.x.min] The lower bound for the normalized coordinate (optional:
   * `0x0` by default).
   * @param {number} [max=LIMITS.x.max] The upper bound for the normalized coordinate (optional:
   * `0xFFF` by default).
   * @param {number} [length] The intended length of the resulting string; the result will be
   * padded with zeroes to the left if its length is smaller than this value, or sliced to its
   * `length` last digits if greater (optionl: the string will not be sliced nor padded if this
   * is not provided).
   * @param {(min: number, max: number) => number} [center=null] A function that calculates the
   * center of the interval from its lower and upper bounds (optional: `null` by default; ignored
   * if `boundary` isn't provided).
   * @param {(min: number, max: number) => number} [boundary=null] A function that calculates the
   * upper limit over which the normalized coordinate should loop over (optional: `null` by
   * default; ignored if `center` isn't provided).
   * @returns {string} The normalized coordinate string.
   */
  private normalizeCoordinate(
    coordinate: string,
    min: number = LIMITS.x.min,
    max: number = LIMITS.x.max,
    length?: number,
    center: (min: number, max: number) => number = null,
    boundary: (min: number, max: number) => number = null
  ): string {
    let normalized = parseInt(coordinate, 16);

    if (isNaN(normalized)) { normalized = 0; }

    if (normalized < min) {
      normalized = min;
    } else if (normalized > max) {
      normalized = max;
    }

    if (center && boundary) {
      normalized += center(min, max);
      normalized %= boundary(min, max);
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
   * Converts a galactic address into the corresponding portal address.
   *
   * @param {string} address The string of signal booster coordinates to be converted.
   * @param {string} [portalId=`${MIN_P}`] The ID of the portal within the target system, limited to
   * `1..6` (optional: `'1'` by default).
   * @returns {string} The converted portal address.
   */
  convertGalacticAddress(address: string, portalId: string = LIMITS.p.min.toString(16)): string {
    let [xCoord, yCoord, zCoord, systemId] = address.split(':');

    const center = (min: number, max: number): number => {
      return Math.floor((max - min) / 2) + 2;
    };
    const boundary = (min: number, max: number): number => {
      return (max - min) + 1;
    };

    xCoord   = this.normalizeCoordinate(xCoord,   LIMITS.x.min, LIMITS.x.max, LIMITS.x.length, center, boundary);
    yCoord   = this.normalizeCoordinate(yCoord,   LIMITS.y.min, LIMITS.y.max, LIMITS.y.length, center, boundary);
    zCoord   = this.normalizeCoordinate(zCoord,   LIMITS.z.min, LIMITS.z.max, LIMITS.z.length, center, boundary);
    systemId = this.normalizeCoordinate(systemId, LIMITS.s.min, LIMITS.s.max, LIMITS.s.length);
    portalId = this.normalizeCoordinate(portalId, LIMITS.p.min, LIMITS.p.max, LIMITS.p.length);

    return portalId + systemId + yCoord + zCoord + xCoord;
  }

  /**
   * Converts a portal address into the corresponding galactic address.
   *
   * @param {string} address The string of portal glyphs values to be converted.
   * @returns {string} The converted galactic address.
   */
  convertPortalAddress(address: string): string {
    // tslint:disable-next-line:prefer-const
    let [match, systemId, yCoord, zCoord, xCoord] = address.match(/[0-9A-F]{1}([0-9A-F]{3})([0-9A-F]{2})([0-9A-F]{3})([0-9A-F]{3})/);

    const center = (min: number, max: number): number => {
      return Math.floor((max - min) / 2);
    };
    const boundary = (min: number, max: number): number => {
      return (max - min) + 1;
    };

    xCoord   = this.normalizeCoordinate(xCoord,   LIMITS.x.min, LIMITS.x.max, 4, center, boundary);
    yCoord   = this.normalizeCoordinate(yCoord,   LIMITS.y.min, LIMITS.y.max, 4, center, boundary);
    zCoord   = this.normalizeCoordinate(zCoord,   LIMITS.z.min, LIMITS.z.max, 4, center, boundary);
    systemId = this.normalizeCoordinate(systemId, LIMITS.s.min, LIMITS.s.max, 4);

    return [xCoord, yCoord, zCoord, systemId].join(':');
  }

}
