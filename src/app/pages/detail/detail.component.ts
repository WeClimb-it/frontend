import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeoLocation } from 'src/app/classes/geolocation.class';
import { CompetitionResult, CragResult, HikeResult, PlaceResult, ShelterResult } from 'src/app/graphql/queries';
import { StateProperties, StateService } from 'src/app/services/state.service';
import { WciApiService } from 'src/app/services/wciApi.service';
import { ContentType } from 'src/app/utils/ContentType';
import { Poi } from 'src/app/utils/Poi';

type Results = CragResult | HikeResult | ShelterResult | PlaceResult | CompetitionResult;

@Component({
  selector: 'wci-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailComponent implements OnInit, OnDestroy {
  contentType: ContentType;
  currentLocation: GeoLocation;
  userLocation: GeoLocation;
  data: Poi;
  useMetricSystem = true;

  isLoading = true;
  isErrored = false;

  private subs$ = new Subscription();

  constructor(private route: ActivatedRoute, private api: WciApiService, private state: StateService) {
    this.contentType = this.route.snapshot.data.type;

    this.subs$.add(
      this.state.app.watchProperty<GeoLocation>(StateProperties.CURRENT_LOCATION).subscribe((location: GeoLocation) => {
        if (location) {
          this.currentLocation = location;
        }
      }),
    );

    this.subs$.add(
      this.state.app
        .watchProperty<GeoLocation>(StateProperties.CURRENT_USER_LOCATION)
        .subscribe((location: GeoLocation) => {
          if (location) {
            this.userLocation = location;
          }
        }),
    );

    this.subs$.add(
      this.state.app.watchProperty(StateProperties.USE_METRIC_SYSTEM, true).subscribe((flag: boolean) => {
        this.useMetricSystem = flag;
      }),
    );
  }

  ngOnInit(): void {
    this.subs$.add(
      this.route.params.subscribe((params: Params) => {
        // Load data on slug change
        if (params.slug || params.nodeId) {
          this.loadData(params.slug || params.nodeId);
        } else {
          this.isErrored = true;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  /**
   *
   */
  private loadData(refId: string): void {
    let query = null;
    let opts = {};
    let resultPayloadProperty: ContentType;
    resultPayloadProperty = this.route.snapshot.data.type;

    switch (this.contentType) {
      default:
        throw new Error(`Unexpected content type was given [${this.contentType}].`);
      case ContentType.CRAG:
        query = this.api.getCrag;
        opts = { slug: refId };
        break;
      case ContentType.HIKE:
        query = this.api.getHike;
        opts = { slug: refId };
        break;
      case ContentType.SHELTER:
        query = this.api.getShelter;
        opts = { slug: refId };
        break;
      case ContentType.PLACE:
        query = this.api.getPlace;
        opts = { slug: refId };
        break;
      case ContentType.COMPETITION:
        query = this.api.getCompetition;
        opts = { slug: refId };
        break;
      case ContentType.OSM_NODE:
        query = this.api.getOpenStreetMapNode;
        opts = { nodeId: refId };
        break;
    }

    if (typeof query === 'function') {
      this.isLoading = true;

      const sub$ = query(opts).subscribe((res: Results) => {
        if (res.errors) {
          throw new Error('Something went wrong during the nearby query');
        }

        if (!res.loading) {
          if (res.errors) {
            this.isErrored = true;
          } else {
            this.isLoading = false;
            this.data = res.data[resultPayloadProperty];
            this.updateCurrentLocationInStore();
            sub$.unsubscribe();
          }
        }
      });
    }
  }

  /**
   *
   */
  private updateCurrentLocationInStore(): void {
    if (this.data.coords) {
      const detailLocation = new GeoLocation(
        this.data.coords.lat,
        this.data.coords.lng,
        undefined,
        (this.data as any).title || (this.data as any).name,
      );
      this.state.app.setProperty(StateProperties.CURRENT_LOCATION, detailLocation);
    }
  }
}
