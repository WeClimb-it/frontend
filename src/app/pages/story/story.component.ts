import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { StoryResult } from 'src/app/graphql/queries';
import { GeoJSONFeature } from 'src/app/interfaces/geo/GeoJSONFeature.interface';
import { Coords, Story } from 'src/app/interfaces/graphql';
import { AppStoreService } from 'src/app/services/appState.service';
import { MetaService } from 'src/app/services/meta.services';
import { WciApiService } from 'src/app/services/wciApi.service';
import { getGeoJsonFromCoords } from 'src/app/utils/Map';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'wci-story',
  templateUrl: 'story.component.html',
  styleUrls: ['story.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class StoryComponent implements OnInit, OnDestroy {
  @Input() mapStyle = environment.mapbox.styleLight;

  isMapMoving = false;
  isLoading = false;
  story: Story;

  private subs$: Subscription[] = [];
  private articlesLocationMap: Map<
    string,
    {
      type: string;
      features: GeoJSONFeature[];
    }
  > = new Map();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: WciApiService,
    private appStore: AppStoreService,
    private metaService: MetaService,
  ) {}

  ngOnInit() {
    this.subs$.push(
      this.route.params.subscribe((params: Params) => {
        if (params.slug) {
          this.loadData(params.slug);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub$) => sub$.unsubscribe());
  }

  getGeoJsonFromArticle(coords: Coords): {
    type: string;
    features: GeoJSONFeature[];
  } {
    const id = `${coords.lng},${coords.lat}`;
    const cachedCoords = this.articlesLocationMap.get(id);

    if (cachedCoords) {
      return cachedCoords;
    } else {
      const geoJson = getGeoJsonFromCoords([coords.lng, coords.lat]);
      this.articlesLocationMap.set(id, geoJson);

      return geoJson;
    }
  }

  onMapBusy(state: boolean): void {
    this.isMapMoving = state;
  }

  onMissingContent(): void {
    this.router.navigate(['404']);
  }

  closeStory(): void {
    this.router.navigate(['']);
  }

  goToTheMap(coords: Coords): void {
    this.appStore.setProperty('mapCenter', `${coords.lat.toFixed(4)},${coords.lng.toFixed(4)}`);
    this.router.navigate([`${coords.lat.toFixed(4)},${coords.lng.toFixed(4)}`]);
  }

  private loadData(slug: string): void {
    this.isLoading = true;

    this.api
      .getStory({ slug })
      .pipe(first())
      .subscribe((res: StoryResult) => {
        this.isLoading = res.loading;

        if (res.errors || isEmpty(res.data?.story)) {
          this.onMissingContent();
          return;
        }

        if (!res.loading) {
          this.story = res.data.story;

          this.metaService.setDetailSocialMedia(
            this.story.pageTitle,
            this.story.description,
            location.href,
            `https://www.weclimb.it/assets/stories/${this.story.thumbnailImage}`,
          );
        }
      });
  }
}
