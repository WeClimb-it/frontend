import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getDistance } from 'geolib';
import moment, { Duration } from 'moment';
import { environment } from 'src/environments/environment';
import { GeoLocation } from '../classes/geolocation.class';
import { Coords } from '../interfaces/graphql';
import { StateProperties, StateService } from './state.service';

const WINDOW: any = window || {};

export interface PlaceSuggestion {
  description: string;
  id: string;
  place_id: string;
  geo?: GeoLocation;
}

export enum JourneyMode {
  WALK = 'walk',
  CAR = 'car',
}

@Injectable({ providedIn: 'root' })
export class GeoService {
  // in km/h
  private AVG_HUMAN_SPEED = 3.6;
  private AVG_CAR_SPEED = 85;

  private mapboxToken = environment.mapbox.token;

  constructor(
    private httpClient: HttpClient,
    private translateService: TranslateService,
    private state: StateService,
  ) {}

  /**
   *
   */
  getPlaces(query: string, minChars: number, maxResults: number): Promise<PlaceSuggestion[]> {
    return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      if (query.length <= minChars) {
        resolve([]);
        return;
      }

      const autocomplete = this.getAutoCompleteServiceInstance();
      autocomplete.getPlacePredictions(
        // For further configurations see:
        // https://developers.google.com/maps/documentation/javascript/reference/#AutocompletionRequest
        { input: query },
        (predictions: PlaceSuggestion[], serviceStatus: any) => {
          if (serviceStatus !== this.getPlacesServiceStatus()) {
            resolve([]);
          } else {
            resolve(predictions.slice(0, maxResults));
          }
        },
      );
    });
  }

  /**
   *
   */
  geocodeByPlaceId(placeId: string): Promise<any> {
    const geocoder = this.getGeocoderInstance();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ placeId }, (results: any, status: any) => {
        if (status !== this.getGeocoderStatus()) {
          reject(
            new Error(`Geocoding query for a place with an ID of '${placeId}' failed - response status: ${status}`),
          );
          return;
        }

        resolve(results);
      });
    });
  }

  /**
   *
   */
  getDistanceFromCoords(source: GeoLocation, destination: GeoLocation): number {
    // Meters in float
    const distance =
      getDistance(
        { latitude: source.lat, longitude: source.lng },
        { latitude: destination.lat, longitude: destination.lng },
      ) / 1000;

    return +distance.toFixed(2);
  }

  /**
   *
   */
  getDistanceInTime(
    metricValue: number,
    mode: JourneyMode,
  ): {
    value: string;
    unit: 'hrs' | 'days';
  } {
    let avgSpeed = 0;
    switch (mode) {
      default:
      case JourneyMode.WALK:
        avgSpeed = this.AVG_HUMAN_SPEED;
        break;
      case JourneyMode.CAR:
        avgSpeed = this.AVG_CAR_SPEED;
        break;
    }

    const hours = metricValue / avgSpeed;
    const duration: Duration = moment.duration(hours, 'hours');
    const asHours = duration.asHours();
    const asDays = Math.ceil(duration.asDays());

    const output = asHours >= 24 ? asDays.toString() : moment.utc(duration.asMilliseconds()).format('HH:mm');

    return {
      value: output,
      unit: asHours >= 24 ? this.translateService.instant('DAYS') : this.translateService.instant('HRS'),
    };
  }

  /**
   *
   */
  getGpxFileContent(url: string): Promise<string> {
    return new Promise((resolve) => {
      this.httpClient
        .get(`${environment.rest.url}/track/${btoa(url)}`, { responseType: 'text' })
        .subscribe((data) => resolve(data));
    });
  }

  /**
   *
   */
  openGpxFileContent(url: string): void {
    // TODO: Use the Content-disposition header on the BE to download the file
    window.open(`${environment.rest.url}/track/${btoa(url)}`);
  }

  /**
   *
   */
  watchLocationFromBrowser(success: (location) => void, error: () => void): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (location) => {
          this.state.app.setProperty(StateProperties.USE_GEOLOC, true);
          success(location);
        },
        error,
        { enableHighAccuracy: true },
      );
    } else {
      error();
    }
  }

  /**
   *
   */
  getLocationFromBrowser(success: (location) => void, error: () => void): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          this.state.app.setProperty(StateProperties.USE_GEOLOC, true);
          success(location);
        },
        error,
        { enableHighAccuracy: true },
      );
    } else {
      error();
    }
  }

  /**
   *
   */
  watchDeviceHorizontalOrientation(success: (orientation: number) => void, error: () => void): void {
    if (!window.DeviceOrientationEvent) {
      error();
      return;
    }

    const handler = (event: DeviceOrientationEvent) => {
      const isUnexpectedEvent = !event.absolute && !(event as any).webkitCompassHeading;

      if (isUnexpectedEvent) {
        window.removeEventListener('deviceorientationabsolute', handler);
        window.removeEventListener('deviceorientation', handler);
        error();
        return;
      }

      const alpha = (event as any).webkitCompassHeading || Math.abs(event.alpha - 360);
      if (alpha) {
        success(alpha);
      } else {
        error();
      }
    };

    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handler, true);
    } else if ('deviceorientation' in window) {
      window.addEventListener('deviceorientation', handler, true);
    } else {
      error();
    }
  }

  /**
   *
   *
   */
  getStaticMapUrl(coords: Coords, width: number = 360, height: number = 280, zoom: number = 10): string {
    return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/${coords.lng},${coords.lat},${zoom},0/${width}x${height}@2x?access_token=${this.mapboxToken}`;
  }

  private getGeocoderInstance(): any {
    return WINDOW && WINDOW.google && WINDOW.google.maps ? new WINDOW.google.maps.Geocoder() : {};
  }

  private getAutoCompleteServiceInstance(): any {
    return WINDOW && WINDOW.google && WINDOW.google.maps ? new WINDOW.google.maps.places.AutocompleteService() : {};
  }

  private getGeocoderStatus(): any {
    return WINDOW && WINDOW.google && WINDOW.google.maps ? WINDOW.google.maps.GeocoderStatus.OK : '';
  }

  private getPlacesServiceStatus(): any {
    return WINDOW && WINDOW.google && WINDOW.google.maps ? WINDOW.google.maps.places.PlacesServiceStatus.OK : '';
  }
}
