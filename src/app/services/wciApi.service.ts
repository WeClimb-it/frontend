import { Injectable } from '@angular/core';
import { FetchPolicy } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

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
  UserInfoResult,
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
} from '../interfaces/graphql';

@Injectable({ providedIn: 'root' })
export class WciApiService {
  constructor(private apollo: Apollo) {
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getNearby = this.getNearby.bind(this);
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
    this.getOpenStreetMapNodes = this.getOpenStreetMapNodes.bind(this);
    this.getOpenStreetMapNode = this.getOpenStreetMapNode.bind(this);
  }

  public defaultFetchPolicy: FetchPolicy = 'cache-first';
  public networkFetchPolicy: FetchPolicy = 'network-only';
  public noCacheFetchPolicy: FetchPolicy = 'no-cache';

  getUserInfo(): Observable<UserInfoResult> {
    return this.apollo.watchQuery({
      query: Queries.userInfo,
    }).valueChanges as Observable<UserInfoResult>;
  }

  getNearby(opts: NearbyOnQueryArguments): Observable<NearbyResult> {
    return this.apollo.watchQuery({
      query: Queries.nearby,
      variables: opts,
    }).valueChanges as Observable<NearbyResult>;
  }

  getForecast(opts: ForecastOnQueryArguments): Observable<ForecastResult> {
    return this.apollo.watchQuery({
      query: Queries.forecast,
      variables: opts,
    }).valueChanges as Observable<ForecastResult>;
  }

  getLatest(opts: LatestOnQueryArguments): Observable<LatestResult> {
    return this.apollo.watchQuery({
      query: Queries.latest,
      variables: opts,
    }).valueChanges as Observable<LatestResult>;
  }

  getCrags(opts: CragsOnQueryArguments): Observable<CragsResult> {
    return this.apollo.watchQuery({
      query: Queries.crags,
      variables: opts,
    }).valueChanges as Observable<CragsResult>;
  }

  getCrag(opts: CragOnQueryArguments): Observable<CragResult> {
    return this.apollo.watchQuery({
      query: Queries.crag,
      variables: opts,
    }).valueChanges as Observable<CragResult>;
  }

  getSectors(): void {
    // TODO
  }

  getSector(opts: SectorOnQueryArguments): Observable<SectorResult> {
    return this.apollo.watchQuery({
      query: Queries.sector,
      variables: opts,
    }).valueChanges as Observable<SectorResult>;
  }

  getRoutes(): void {
    // TODO
  }

  getRoute(opts: RouteOnQueryArguments): Observable<RouteResult> {
    return this.apollo.watchQuery({
      query: Queries.route,
      variables: opts,
    }).valueChanges as Observable<RouteResult>;
  }

  getPlaces(opts: PlacesOnQueryArguments): Observable<PlacesResult> {
    return this.apollo.watchQuery({
      query: Queries.places,
      variables: opts,
    }).valueChanges as Observable<PlacesResult>;
  }

  getPlace(opts: PlaceOnQueryArguments): Observable<PlaceResult> {
    return this.apollo.watchQuery({
      query: Queries.place,
      variables: opts,
    }).valueChanges as Observable<PlaceResult>;
  }

  getEvents(opts: EventsOnQueryArguments): Observable<EventsResult> {
    return this.apollo.watchQuery({
      query: Queries.events,
      variables: opts,
    }).valueChanges as Observable<EventsResult>;
  }

  getEvent(opts: EventOnQueryArguments): Observable<EventResult> {
    return this.apollo.watchQuery({
      query: Queries.event,
      variables: opts,
    }).valueChanges as Observable<EventResult>;
  }

  getSearchResults(opts: SearchOnQueryArguments): Observable<SearchResult> {
    return this.apollo.watchQuery({
      query: Queries.search,
      variables: opts,
      fetchPolicy: 'no-cache',
    }).valueChanges as Observable<SearchResult>;
  }

  getHike(opts: HikeOnQueryArguments): Observable<HikeResult> {
    return this.apollo.watchQuery({
      query: Queries.hike,
      variables: opts,
    }).valueChanges as Observable<HikeResult>;
  }

  getHikes(opts: HikesOnQueryArguments): Observable<HikesResult> {
    return this.apollo.watchQuery({
      query: Queries.hikes,
      variables: opts,
    }).valueChanges as Observable<HikesResult>;
  }

  getShelter(opts: ShelterOnQueryArguments): Observable<ShelterResult> {
    return this.apollo.watchQuery({
      query: Queries.shelter,
      variables: opts,
    }).valueChanges as Observable<ShelterResult>;
  }

  getShelters(opts: SheltersOnQueryArguments): Observable<SheltersResult> {
    return this.apollo.watchQuery({
      query: Queries.shelters,
      variables: opts,
    }).valueChanges as Observable<SheltersResult>;
  }

  getCompetition(opts: CompetitionOnQueryArguments): Observable<CompetitionResult> {
    return this.apollo.watchQuery({
      query: Queries.competition,
      variables: opts,
    }).valueChanges as Observable<CompetitionResult>;
  }

  getCompetitions(opts: CompetitionsOnQueryArguments): Observable<CompetitionsResult> {
    return this.apollo.watchQuery({
      query: Queries.competitions,
      variables: opts,
    }).valueChanges as Observable<CompetitionsResult>;
  }

  getNews(opts: NewsOnQueryArguments): Observable<NewsResult> {
    return this.apollo.watchQuery({
      query: Queries.news,
      variables: opts,
      fetchPolicy: this.noCacheFetchPolicy,
    }).valueChanges as Observable<NewsResult>;
  }

  getOneNews(opts: OneNewsOnQueryArguments): Observable<OneNewsResult> {
    return this.apollo.watchQuery({
      query: Queries.oneNews,
      variables: opts,
    }).valueChanges as Observable<OneNewsResult>;
  }

  getOpenStreetMapNodes(opts: { lat: number; lng: number; distance: number }): Observable<object> {
    return this.apollo.watchQuery({
      query: Queries.osmNodes,
      variables: opts,
    }).valueChanges as Observable<object>;
  }

  getOpenStreetMapNode(opts: { nodeId: string }): Observable<object> {
    return this.apollo.watchQuery({
      query: Queries.osmNode,
      variables: opts,
    }).valueChanges as Observable<object>;
  }

  getPhotos(opts: { query: string }): Observable<object> {
    return this.apollo.watchQuery({
      query: Queries.photos,
      variables: opts,
    }).valueChanges as Observable<object>;
  }
}
