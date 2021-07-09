import { Injectable } from '@angular/core';
import { FetchPolicy } from '@apollo/client/core';
import { from, Observable } from 'rxjs';
import Queries, {
  CompetitionResult,
  CompetitionsResult,
  CragResult,
  CragsResult,
  EventResult,
  EventsResult,
  ForecastResult,
  HikeResult,
  HikesResult,
  LatestResult,
  NearbyResult,
  NewsResult,
  OneNewsResult,
  PlaceResult,
  PlacesResult,
  RouteResult,
  SearchResult,
  SectorResult,
  ShelterResult,
  SheltersResult,
  StoriesResult,
  StoryResult,
  UserInfoResult,
  WaveUserResult,
} from '../graphql/queries';
import {
  CompetitionOnQueryArguments,
  CompetitionsOnQueryArguments,
  CragOnQueryArguments,
  CragsOnQueryArguments,
  EventOnQueryArguments,
  EventsOnQueryArguments,
  ForecastOnQueryArguments,
  HikeOnQueryArguments,
  HikesOnQueryArguments,
  LatestOnQueryArguments,
  NearbyOnQueryArguments,
  NewsOnQueryArguments,
  OneNewsOnQueryArguments,
  PlaceOnQueryArguments,
  PlacesOnQueryArguments,
  RouteOnQueryArguments,
  SearchOnQueryArguments,
  SectorOnQueryArguments,
  ShelterOnQueryArguments,
  SheltersOnQueryArguments,
  StoriesOnQueryArguments,
  StoryOnQueryArguments,
  WaveUserOnQueryArguments,
} from '../interfaces/graphql';
import { ApolloService } from './apollo.service';

@Injectable({ providedIn: 'root' })
export class WciApiService {
  constructor(private service: ApolloService) {
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getNearbyCancelable = this.getNearbyCancelable.bind(this);
    this.getForecast = this.getForecast.bind(this);
    this.getLatest = this.getLatest.bind(this);
    this.getCrags = this.getCrags.bind(this);
    this.getCrag = this.getCrag.bind(this);
    this.getSectors = this.getSectors.bind(this);
    this.getSector = this.getSector.bind(this);
    this.getRoutes = this.getRoutes.bind(this);
    this.getRoute = this.getRoute.bind(this);
    this.getPlaces = this.getPlaces.bind(this);
    this.getPlace = this.getPlace.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.getHikes = this.getHikes.bind(this);
    this.getHike = this.getHike.bind(this);
    this.getShelters = this.getShelters.bind(this);
    this.getShelter = this.getShelter.bind(this);
    this.getCompetitions = this.getCompetitions.bind(this);
    this.getCompetition = this.getCompetition.bind(this);
    this.getNews = this.getNews.bind(this);
    this.getOneNews = this.getOneNews.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.getOpenStreetMapNodesCancelable = this.getOpenStreetMapNodesCancelable.bind(this);
    this.getGooglePlacesCancelable = this.getGooglePlacesCancelable.bind(this);
    this.getOpenStreetMapNode = this.getOpenStreetMapNode.bind(this);

    this.service.init();
  }

  defaultFetchPolicy: FetchPolicy = 'cache-first';
  networkFetchPolicy: FetchPolicy = 'network-only';
  noCacheFetchPolicy: FetchPolicy = 'no-cache';

  getUserInfo(): Observable<UserInfoResult> {
    return from(
      this.service.client.query({
        query: Queries.userInfo,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getNearbyCancelable(opts: NearbyOnQueryArguments): {
    controller: AbortController;
    observable: Observable<NearbyResult>;
  } {
    const controller = new window.AbortController();

    return {
      controller,
      observable: from(
        this.service.client.query({
          query: Queries.nearby,
          variables: opts,
          fetchPolicy: this.noCacheFetchPolicy,
          context: { fetchOptions: { signal: controller.signal } },
        }),
      ),
    };
  }

  getOpenStreetMapNodesCancelable(opts: { lat: number; lng: number; distance: number }): {
    controller: AbortController;
    observable: Observable<object>;
  } {
    const controller = new window.AbortController();
    return {
      controller,
      observable: from(
        this.service.client.query({
          query: Queries.osmNodes,
          variables: opts,
          fetchPolicy: this.noCacheFetchPolicy,
          context: { fetchOptions: { signal: controller.signal } },
        }),
      ),
    };
  }

  getGooglePlacesCancelable(opts: { lat: number; lng: number; distance: number }): {
    controller: AbortController;
    observable: Observable<object>;
  } {
    const controller = new window.AbortController();
    return {
      controller,
      observable: from(
        this.service.client.query({
          query: Queries.googlePlaces,
          variables: opts,
          fetchPolicy: this.noCacheFetchPolicy,
          context: { fetchOptions: { signal: controller.signal } },
        }),
      ),
    };
  }

  getForecast(opts: ForecastOnQueryArguments): Observable<ForecastResult> {
    return from(
      this.service.client.query({
        query: Queries.forecast,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getLatest(opts: LatestOnQueryArguments): Observable<LatestResult> {
    return from(
      this.service.client.query({
        query: Queries.latest,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getCrags(opts: CragsOnQueryArguments): Observable<CragsResult> {
    return from(
      this.service.client.query({
        query: Queries.crags,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getCrag(opts: CragOnQueryArguments): Observable<CragResult> {
    return from(
      this.service.client.query({
        query: Queries.crag,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getSectors(): void {
    // TODO
  }

  getSector(opts: SectorOnQueryArguments): Observable<SectorResult> {
    return from(
      this.service.client.query({
        query: Queries.sector,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getRoutes(): void {
    // TODO
  }

  getRoute(opts: RouteOnQueryArguments): Observable<RouteResult> {
    return from(
      this.service.client.query({
        query: Queries.route,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getPlaces(opts: PlacesOnQueryArguments): Observable<PlacesResult> {
    return from(
      this.service.client.query({
        query: Queries.places,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getPlace(opts: PlaceOnQueryArguments): Observable<PlaceResult> {
    return from(
      this.service.client.query({
        query: Queries.place,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getEvents(opts: EventsOnQueryArguments): Observable<EventsResult> {
    return from(
      this.service.client.query({
        query: Queries.events,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getEvent(opts: EventOnQueryArguments): Observable<EventResult> {
    return from(
      this.service.client.query({
        query: Queries.event,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getSearchResults(opts: SearchOnQueryArguments): Observable<SearchResult> {
    return from(
      this.service.client.query({
        query: Queries.search,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getHike(opts: HikeOnQueryArguments): Observable<HikeResult> {
    return from(
      this.service.client.query({
        query: Queries.hike,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getHikes(opts: HikesOnQueryArguments): Observable<HikesResult> {
    return from(
      this.service.client.query({
        query: Queries.hikes,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getShelter(opts: ShelterOnQueryArguments): Observable<ShelterResult> {
    return from(
      this.service.client.query({
        query: Queries.shelter,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getShelters(opts: SheltersOnQueryArguments): Observable<SheltersResult> {
    return from(
      this.service.client.query({
        query: Queries.shelters,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getCompetition(opts: CompetitionOnQueryArguments): Observable<CompetitionResult> {
    return from(
      this.service.client.query({
        query: Queries.competition,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getCompetitions(opts: CompetitionsOnQueryArguments): Observable<CompetitionsResult> {
    return from(
      this.service.client.query({
        query: Queries.competitions,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getNews(opts: NewsOnQueryArguments): Observable<NewsResult> {
    return from(
      this.service.client.query({
        query: Queries.news,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getOneNews(opts: OneNewsOnQueryArguments): Observable<OneNewsResult> {
    return from(
      this.service.client.query({
        query: Queries.oneNews,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getOpenStreetMapNode(opts: { nodeId: string }): Observable<object> {
    return from(
      this.service.client.query({
        query: Queries.osmNode,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getPhotos(opts: { query: string }): Observable<object> {
    return from(
      this.service.client.query({
        query: Queries.photos,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  waveUser(opts: WaveUserOnQueryArguments): Observable<WaveUserResult> {
    return from(
      this.service.client.query({
        query: Queries.waveUser,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getStories(opts: StoriesOnQueryArguments): Observable<StoriesResult> {
    return from(
      this.service.client.query({
        query: Queries.stories,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }

  getStory(opts: StoryOnQueryArguments): Observable<StoryResult> {
    return from(
      this.service.client.query({
        query: Queries.story,
        variables: opts,
        fetchPolicy: this.noCacheFetchPolicy,
      }),
    );
  }
}
