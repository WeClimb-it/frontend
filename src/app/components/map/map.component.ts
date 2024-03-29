import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { each, size } from 'lodash';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { MapComponent as MapBoxComponent } from 'ngx-mapbox-gl';
import { MarkerComponent } from 'ngx-mapbox-gl/lib/marker/marker.component';
import { GeoLocation } from 'src/app/classes/geolocation.class';
import { MapUpdateEvent } from 'src/app/interfaces/events/map-update.interface';
import { GeoTrack } from 'src/app/interfaces/geotrack.interface';
import { Competition, Crag, Hike, Place, Shelter } from 'src/app/interfaces/graphql';
import { getGeoJsonFromCoords } from 'src/app/utils/Map';
import { getPoiCategoryClass, getPoiCategoryTag, Poi } from 'src/app/utils/Poi';
import { environment } from 'src/environments/environment';
import { GeoJSON, GeoJSONFeature } from '../../interfaces/geo/GeoJSONFeature.interface';

export enum POI_TYPE {
  CRAG = 'crag',
  SECTOR = 'sector',
  ROUTE = 'route',
  EVENT = 'event',
  SHELTER = 'shelter',
  PLACE = 'place',
  HIKE = 'hike',
  COMPETITION = 'competition',
}

interface Pois {
  crags: Entities;
  places: Entities;
  competitions: Entities;
  shelters: Entities;
  hikes: Entities;
}

type Entity = Crag | Place | Competition | Shelter | Hike;
type Entities = Crag[] | Place[] | Competition[] | Shelter[] | Hike[];

@Component({
  selector: 'wci-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnChanges {
  @ViewChild('map') map: MapBoxComponent;
  @Input() zoom: number;
  @Input() centerLocation: GeoLocation;
  @Input() userOrientation: number;
  @Input() userLocation: GeoLocation;
  @Input() pois: Pois;
  @Input() osmPois: GeoJSON;
  @Input() googlePlacesPois: Entities;

  @Input() mapStyle = environment.mapbox.style;
  @Input() mapTerrainStyle = environment.mapbox.styleTerrain;
  @Input() tracks: GeoTrack[];

  @Input() loadingWciData: boolean;
  @Input() loadingOsmData: boolean;
  @Input() loadingGooglePlacesData: boolean;

  @Output() ready = new EventEmitter<MapUpdateEvent>();
  @Output() update = new EventEmitter<MapUpdateEvent>();
  @Output() centerMapToUserLocation = new EventEmitter<void>();

  @ViewChild('userMarker') userMarker: MarkerComponent;

  currentMapStyle = this.mapStyle;

  MARKER_TYPE = {
    CRAG: 'crag-pin',
    PLACE: 'place-pin',
    EVENT: 'event-pin',
    SHELTER: 'shelter-pin',
    HIKE: 'hike-pin',
    DRINKING_WATER: 'drinking-water-pin',
  };

  ENTITY_NAMESPACE = {
    CRAG: 'crags',
    PLACE: 'places',
    EVENT: 'competitions',
    SHELTER: 'shelters',
    HIKE: 'hikes',
  };

  OSM_WCI_MARKER_TYPE_MAP = {
    'natural.peak': this.MARKER_TYPE.CRAG,
    'natural.valley': this.MARKER_TYPE.CRAG,
    'natural.cliff': this.MARKER_TYPE.CRAG,
    'route.hiking': this.MARKER_TYPE.HIKE,
    'highway.footway': this.MARKER_TYPE.HIKE,
    'amenity.drinking_water': this.MARKER_TYPE.DRINKING_WATER,
  };

  SOURCES = {
    WCI: 'wci',
    OSM: 'osm',
    GOOGLE_PLACES: 'googlePlaces',
  };

  USER_LOCATION_SYMBOL = 'user-location-symbol';
  USER_LOCATION_COLOR_RGB = '251, 197, 49';
  USER_DIRECTION_COLOR_RGB = '232, 65, 24';

  CENTER_LOCATION_COLOR_RGB = '255, 71, 87';
  CLUSTER_COLOR_RGB = '64,205,126';

  pins: { [key: string]: ImageData };

  centerCoords: number[];
  centerLocationGeoJson: GeoJSON;

  userCoords: number[];
  userLocationGeoJson: GeoJSON;

  geoJson: GeoJSON;
  osmGeoJson: GeoJSON;
  googlePlacesGeoJson: GeoJSON;
  selectedFeatures: MapboxGeoJSONFeature | GeoJSONFeature[] = [];
  selectedCoordinates: unknown;

  // Default props
  pitch = 60;
  bearing = 0;
  minZoom = 8;
  maxZoom = 22;
  max3dZoom = 14;
  clusterMaxZoom = 17;
  clusterRadius = 50;
  clusterColor = `rgba(${this.CLUSTER_COLOR_RGB}, 0.7)`;
  clusterSizes = [
    [0, 20],
    [20, 40],
    [50, 60],
  ];

  // Flags
  isLoading = true;

  private EARTH_RADIUS = 3963.0;
  private RADIANS = 57.2958;

  private maxLoadableRadius = 50; // Miles

  private mapInstance: mapboxgl.Map;

  constructor(
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.centerLocation?.currentValue) {
      this.centerCoords = changes.centerLocation.currentValue.toCoordinates();
      this.updateCenterGeoJSON();
    }

    if (changes.userLocation?.currentValue) {
      this.userCoords = changes.userLocation.currentValue.toCoordinates();
    }

    if (changes.userOrientation?.currentValue && this.userMarker) {
      this.userMarker.markerInstance.setRotation(changes.userOrientation.currentValue);
    }

    if (changes.pois?.currentValue) {
      this.contructGeoJSONFromChange(changes.pois.currentValue);
    }

    if (changes.osmPois?.currentValue) {
      this.hydrateOsmGeoJSON(changes.osmPois.currentValue);
    }

    if (changes.googlePlacesPois?.currentValue) {
      this.hydrateGooglePlacesGeoJSON(changes.googlePlacesPois.currentValue);
    }

    /*
    if (changes.tracks) {
      // Note: tracks are not supported at the moment in the main map
    }
    */
  }

  /**
   *
   */
  mapLoaded(): void {
    this.isLoading = false;
    this.mapInstance = this.map.mapInstance;

    this.init3dTerrain();

    this.emitMapUpdateStatus(true);
  }

  /**
   *
   */
  mapInteractionEnd(): void {
    this.emitMapUpdateStatus();
  }

  /**
   *
   */
  flyTo(lat: number, lng: number): void {
    this.mapInstance.flyTo({ center: [lng, lat] });
  }

  /**
   *
   */
  routeTo(internalLink: string): void {
    this.zone.run(() => {
      this.router.navigate([internalLink]);
    });
  }

  /**
   *
   */
  onMarkerClick($event: any): void {
    const features = this.mapInstance.queryRenderedFeatures($event.point, {
      layers: ['unclustered-pois'],
    });

    if (features.length) {
      const clickedPoint = features[0];
      this.selectedFeatures[0] = clickedPoint;
      this.selectedCoordinates = (clickedPoint.geometry as any).coordinates;
    }
  }

  /**
   *
   */
  onClusterClick($event: any): void {
    const features = this.mapInstance.queryRenderedFeatures($event.point, {
      layers: ['clustered-pois'],
    });

    if (features.length) {
      const clusterId = features[0].properties.cluster_id;
      const pointCount = features[0].properties.point_count;
      const clusterSource: any = this.mapInstance.getSource('pois');
      if (clusterSource) {
        clusterSource.getClusterLeaves(clusterId, pointCount, 0, (err: Error, clusterFeatures: any) => {
          this.selectedFeatures = !err ? clusterFeatures : [];
          this.selectedCoordinates = (features[0].geometry as any).coordinates;
          this.ref.detectChanges();
        });
      }
    }
  }

  /**
   *
   */
  onMapStyleChange(style: string): void {
    this.currentMapStyle = style;
  }

  /**
   *
   */
  closePopup(): void {
    this.selectedFeatures = [];
  }

  /**
   *
   */
  getPoiCategoryTag(item: Poi): string {
    return getPoiCategoryTag(this.translateService, item);
  }

  /**
   *
   */
  getPoiCategoryClass(item: Poi): string {
    return getPoiCategoryClass(this.translateService, item);
  }

  /**
   *
   */
  getMapItemTitle(item: GeoJSONFeature): string {
    return (item.properties.title || item.properties.name || this.translateService.instant('UNKNOWN')) as string;
  }

  /**
   *
   */
  getMapItemWikipage(item: GeoJSONFeature): string {
    if (!item.properties.wikipedia) {
      throw new Error('Cannot derive the wikipedia URL from the given feature');
    }

    return `https://en.wikipedia.org/wiki/${item.properties.wikipedia}`;
  }

  /**
   *
   */
  get mapGeoJson(): GeoJSON {
    return {
      type: 'FeatureCollection',
      features: [
        ...(this.geoJson ? this.geoJson.features : []),
        ...(this.osmGeoJson ? this.osmGeoJson.features : []),
        ...(this.googlePlacesGeoJson ? this.googlePlacesGeoJson.features : []),
      ],
    };
  }

  /**
   *
   */
  get loadingData(): boolean {
    return this.loadingGooglePlacesData || this.loadingOsmData || this.loadingWciData;
  }

  /**
   *
   */
  get hasMultiItems(): boolean {
    return size(this.selectedFeatures) > 1;
  }

  /**
   *
   */
  private emitMapUpdateStatus(firstLoad = false): void {
    if (!this.mapInstance) {
      return;
    }

    const { lng, lat } = this.mapInstance.getCenter();

    (firstLoad ? this.ready : this.update).emit({
      coordinates: [lng, lat],
      zoom: this.mapInstance.getZoom(),
      radius: this.getRadiusDistance(),
    });
  }

  /**
   *
   */
  private getRadiusDistance(): number {
    const center = this.mapInstance.getCenter();
    const bounds = this.mapInstance.getBounds();

    // From decimal degrees into radians
    const lat1 = center.lat / this.RADIANS;
    const lon1 = center.lng / this.RADIANS;
    const lat2 = bounds.getNorthEast().lat / this.RADIANS;
    const lon2 = bounds.getNorthEast().lng / this.RADIANS;

    const radius = Math.ceil(
      this.EARTH_RADIUS *
        Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)),
    );

    // From radians to miles
    return radius < this.maxLoadableRadius ? radius : this.maxLoadableRadius;
  }

  /**
   *
   */
  private translateToFeatureCollection(
    entities: Entities,
    type: string,
    namespace: string,
    isInternal = true,
  ): GeoJSONFeature[] {
    const output: GeoJSONFeature[] = [];

    each(entities, (e: Entity) => {
      const feature: GeoJSONFeature = {
        type: 'Feature',
        properties: {
          ...e,
          source: this.SOURCES.WCI,
          markerSymbol: type,
          internalLink: isInternal ? `/${namespace}/${e.slug}` : undefined,
          externalLink: !isInternal ? e.resourceUrl : undefined,
        },
        geometry: {
          type: 'Point',
          coordinates: [e.coords ? e.coords.lng : 0, e.coords ? e.coords.lat : 0],
        },
      };
      output.push(feature);
    });

    return output;
  }

  /**
   *
   */
  private contructGeoJSONFromChange(pois: Pois): void {
    this.geoJson = {
      type: 'FeatureCollection',
      features: [
        ...this.translateToFeatureCollection(pois.crags, this.MARKER_TYPE.CRAG, this.ENTITY_NAMESPACE.CRAG),
        ...this.translateToFeatureCollection(pois.competitions, this.MARKER_TYPE.EVENT, this.ENTITY_NAMESPACE.EVENT),
        ...this.translateToFeatureCollection(pois.places, this.MARKER_TYPE.PLACE, this.ENTITY_NAMESPACE.PLACE),
        ...this.translateToFeatureCollection(pois.shelters, this.MARKER_TYPE.SHELTER, this.ENTITY_NAMESPACE.SHELTER),
        ...this.translateToFeatureCollection(pois.hikes, this.MARKER_TYPE.HIKE, this.ENTITY_NAMESPACE.HIKE),
      ],
    };
  }

  /**
   *
   */
  private hydrateOsmGeoJSON(pois: { features: GeoJSONFeature[] }): void {
    const features = [];

    const buildMarker = (poi: GeoJSONFeature): void => {
      each(this.OSM_WCI_MARKER_TYPE_MAP, (mapValue: string, mapKey: string) => {
        const feature = { ...poi };
        const kPieces = mapKey.split('.');
        const key = kPieces[0];
        const value = kPieces[1];

        if (feature.properties[key] === value) {
          feature.properties = {
            ...feature.properties,
            markerSymbol: mapValue,
            source: this.SOURCES.OSM,
            internalLink: `/pois/${(feature.properties.id as string).split('/')[1]}`,
          };

          features.push(feature);
          return false;
        }
      });
    };

    each(pois.features, buildMarker);

    this.osmGeoJson = {
      type: 'FeatureCollection',
      features,
    };
  }

  /**
   *
   */
  private hydrateGooglePlacesGeoJSON(pois: Entities): void {
    this.googlePlacesGeoJson = {
      type: 'FeatureCollection',
      features: [
        ...this.translateToFeatureCollection(pois, this.MARKER_TYPE.PLACE, this.ENTITY_NAMESPACE.PLACE, false),
      ],
    };
  }

  /**
   *
   */
  private updateCenterGeoJSON(): void {
    this.centerLocationGeoJson = getGeoJsonFromCoords(this.centerCoords);
  }

  /**
   *
   */
  private init3dTerrain(): void {
    this.mapInstance.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: this.max3dZoom,
    });

    this.mapInstance.setTerrain({ source: 'mapbox-dem' });

    this.mapInstance.addLayer({
      id: 'sky',
      type: 'sky' as any,
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15,
      } as any,
    });
  }
}
