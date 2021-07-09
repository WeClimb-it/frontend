import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StoryResult } from 'src/app/graphql/queries';
import { GeoJSONFeature } from 'src/app/interfaces/geo/GeoJSONFeature.interface';
import { Coords, Story } from 'src/app/interfaces/graphql';
import { PersistanceService } from 'src/app/services/persistanceService';
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
  @Input() mapStyle = environment.mapbox.style;

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

  constructor(private router: Router, private route: ActivatedRoute, private api: WciApiService) {}

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

  goToTheMap(coords: Coords): void {
    PersistanceService.set('tempMapCenter', `${coords.lat.toFixed(4)},${coords.lng.toFixed(4)}`);
    this.router.navigate([`${coords.lat.toFixed(4)},${coords.lng.toFixed(4)}`]);
  }

  private loadData(slug: string): void {
    this.isLoading = true;

    const sub$ = this.api.getStory({ slug }).subscribe((res: StoryResult) => {
      this.isLoading = res.loading;

      if (res.errors) {
        throw new Error('Something went wrong during the story query');
      }

      if (!res.loading) {
        this.story = res.data.story;
      }

      sub$.unsubscribe();
    });
  }
}
