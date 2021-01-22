// tslint:disable
// graphql typescript definitions
export interface GraphQLResponseRoot {
  data?: Query | Subscription;
  errors?: Array<GraphQLResponseError>;
}

export interface GraphQLResponseError {
  /** Required for all errors */
  message: string;
  locations?: Array<GraphQLResponseErrorLocation>;
  /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
  [propName: string]: any;
}

export interface GraphQLResponseErrorLocation {
  line: number;
  column: number;
}

export interface Query {
  __typename?: 'Query';
  competitions: ListResult;
  upcomingCompetitions: ListResult;
  competition: Competition;
  crags: ListResult;
  crag: Crag;

  /**
   * Returns debug information from the server
   */
  info: Debugnfo;
  events: ListResult;
  event: Event;
  forecast: ForecastResult;
  hikes: ListResult;
  hike: Hike;
  news: ListResult;
  oneNews: News;
  osmNodes: any;
  osmNode: any;
  getPhotos: any;
  getPhotosFromWeb: any;
  places: ListResult;
  place: Place;
  routes: ListResult;
  route: Route;
  search: SearchResult;
  nearby: SearchResult;
  latest: SearchResult;
  sectors: ListResult;
  sector: Sector;
  shelters: ListResult;
  shelter: Shelter;
  usernfo: UserInfo;
}

export interface CompetitionsOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
  lng: number;
  lat: number;
  distance: number;
}

export interface UpcomingCompetitionsOnQueryArguments {
  distance?: number | null;

  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
  lng: number;
  lat: number;
}

export interface CompetitionOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface CragsOnQueryArguments {
  /**
   * @default false
   */
  deep?: boolean | null;

  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
  lng: number;
  lat: number;
  distance: number;
}

export interface CragOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface EventsOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
  lng: number;
  lat: number;
  distance: number;
}

export interface EventOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface ForecastOnQueryArguments {
  lng: number;
  lat: number;
}

export interface HikesOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
  lng: number;
  lat: number;
  distance: number;
}

export interface HikeOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface NewsOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
}

export interface OneNewsOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface OsmNodesOnQueryArguments {
  distance: number;
  lng: number;
  lat: number;
}

export interface OsmNodeOnQueryArguments {
  noded: string;
}

export interface GetPhotosOnQueryArguments {
  query: string;
}

export interface GetPhotosFromWebOnQueryArguments {
  query: string;
}

export interface PlacesOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
  lng: number;
  lat: number;
  distance: number;
}

export interface PlaceOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface RoutesOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
}

export interface RouteOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface SearchOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;

  /**
   * @default -1
   */
  maxDifficulty?: number | null;

  /**
   * @default -1
   */
  minDifficulty?: number | null;

  /**
   * @default -1
   */
  maxPosition?: number | null;

  /**
   * @default -1
   */
  minPosition?: number | null;

  /**
   * @default -1
   */
  maxWeather?: number | null;

  /**
   * @default -1
   */
  minWeather?: number | null;
  query: string;
}

export interface NearbyOnQueryArguments {
  /**
   * @default 5000
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;

  /**
   * @default -1
   */
  maxDifficulty?: number | null;

  /**
   * @default -1
   */
  minDifficulty?: number | null;

  /**
   * @default -1
   */
  maxPosition?: number | null;

  /**
   * @default -1
   */
  minPosition?: number | null;

  /**
   * @default -1
   */
  maxWeather?: number | null;

  /**
   * @default -1
   */
  minWeather?: number | null;
  distance: number;
  lng: number;
  lat: number;
}

export interface LatestOnQueryArguments {
  lng: number;
  lat: number;
}

export interface SectorsOnQueryArguments {
  /**
   * @default false
   */
  deep?: boolean | null;

  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
}

export interface SectorOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface SheltersOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
  lng: number;
  lat: number;
  distance: number;
}

export interface ShelterOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface ListResult {
  __typename?: 'ListResult';
  items: Array<Item>;
  pagination: Pagination;
}

export type Item = Crag | Place | Event | Sector | Route | Competition | News | Shelter | Hike;

export interface Crag {
  __typename?: 'Crag';
  _stats: CragStats;
  slug: string;
  title: string;
  descr: string;
  accessInfo: string;
  coords: Coords;
  altitude: number;
  exposition: string;
  boltingType: string;
  rockType: string;
  qualityRank: QualityRank;
  period: string;
  notes: string;
  resourceUrl: string;
  sectors: Array<Sector>;
  searchScore: number;
}

export interface CragStats {
  __typename?: 'CragStats';
  routesCount: number;
  sectorsCount: number;
}

export interface Coords {
  __typename?: 'Coords';
  lat: number;
  lng: number;
}

export interface QualityRank {
  __typename?: 'QualityRank';
  score: number;
  crowdedness: number;
  weather: number;
  weatherExtended: Array<WeatherExtended>;
  position: number;
  difficulty: number;
  average: number;
  max: number;
  votes: number;
}

export interface WeatherExtended {
  __typename?: 'WeatherExtended';
  coeff: number;
  time: string;
  value: number;
}

export interface Sector {
  __typename?: 'Sector';
  crag: string;
  parent: SectorCrag;
  slug: string;
  title: string;
  coords: Coords;
  notes: string;
  qualityRank: QualityRank;
  minGrade: string;
  maxGrade: string;
  resourceUrl: string;
  routes: Array<Route>;
  searchScore: number;
}

export interface SectorCrag {
  __typename?: 'SectorCrag';
  _stats: CragStats;
  slug: string;
  title: string;
  descr: string;
  accessInfo: string;
  Coords: Coords;
  altitude: number;
  exposition: string;
  boltingType: string;
  rockType: string;
  qualityRank: QualityRank;
  period: string;
  notes: string;
  resourceUrl: string;
}

export interface Route {
  __typename?: 'Route';
  sector: string;
  parent: RouteSector;
  slug: string;
  seqNum: number;
  title: string;
  coords: Coords;
  grade: string;
  pitonsNum: number;
  length: number;
  routeType: string;
  gearType: string;
  notes: string;
  qualityRank: QualityRank;
  resourceUrl: string;
  searchScore: number;
}

export interface RouteSector {
  __typename?: 'RouteSector';
  crag: string;
  parent: SectorCrag;
  slug: string;
  title: string;
  coords: Coords;
  notes: string;
  qualityRank: QualityRank;
  minGrade: string;
  maxGrade: string;
  resourceUrl: string;
}

export interface Place {
  __typename?: 'Place';
  _id: string;
  sociald: string;
  slug: string;
  title: string;
  descr: string;
  coords: Coords;
  openings: Openings;
  notes: string;
  engagement: number;
  checkins: string;
  resourceUrl: string;
  searchScore: number;
  picture: string;
}

export interface Openings {
  __typename?: 'Openings';
  l: number;
}

export interface Event {
  __typename?: 'Event';
  sociald: string;
  slug: string;
  title: string;
  descr: string;
  coords: Coords;
  place: string;
  startTime: string;
  endTime: string;
  resourceUrl: string;
  searchScore: number;
}

export interface Competition {
  __typename?: 'Competition';
  coords: Coords;
  info: Competitionnfo;
  people: Array<CompetitionPerson>;
  poster: string;
  resourceUrl: string;
  schedule: Array<string>;
  slug: string;
  startTime: string;
  endTime: string;
  title: string;
  searchScore: number;
}

export interface Competitionnfo {
  __typename?: 'Competitionnfo';
  categories: Array<string>;
  details: CompetitionDetails;
  place: string;
  specialties: Array<string>;
  types: Array<string>;
}

export interface CompetitionDetails {
  __typename?: 'CompetitionDetails';
  eventWebsite: string;
  infoSheet: string;
  text: string;
}

export interface CompetitionPerson {
  __typename?: 'CompetitionPerson';
  what: string;
  who: string;
}

export interface News {
  __typename?: 'News';
  media: NewsMedia;
  resourceUrl: string;
  slug: string;
  summary: string;
  title: string;
  lang: string;
  searchScore: number;
  creationTime: string;
}

export interface NewsMedia {
  __typename?: 'NewsMedia';
  thumb: string;
}

export interface Shelter {
  __typename?: 'Shelter';
  slug: string;
  name: string;
  descr: string;
  coords: Coords;
  accessInfo: string;
  altitude: string;
  opening: string;
  accomodationsFood: string;
  accomodationsRooms: string;
  beds: number;
  owners: string;
  keepers: string;
  email: string;
  phone: string;
  mobile: string;
  web: string;
  facebook: string;
  media: Array<string>;
  searchScore: number;
  resourceUrl: string;
}

export interface Hike {
  __typename?: 'Hike';
  slug: string;
  title: string;
  trailLabel: string;
  difficulty: string;
  exposition: string;
  elevation: HikeElevation;
  grade: HikeGrade;
  length: number;
  startingPoint: string;
  accessInfo: string;
  notes: string;
  descr: string;
  coords: Coords;
  tracks: Array<string>;
  media: Array<string>;
  searchScore: number;
  resourceUrl: string;
}

export interface HikeElevation {
  __typename?: 'HikeElevation';
  asc: number;
  desc: number;
  low: number;
  high: number;
  ascDiffTot: number;
}

export interface HikeGrade {
  __typename?: 'HikeGrade';
  avg: number;
  max: number;
}

export interface Pagination {
  __typename?: 'Pagination';
  total: number;
  size: number;
  pageCount: number;
  currentPage: number;
}

/**
 * Some debug information about the server
 */
export interface Debugnfo {
  __typename?: 'Debugnfo';
  startedAt: number;
  version: string;
  name: string;
  uptime: number;
}

export interface ForecastResult {
  __typename?: 'ForecastResult';
  now: CurrentWeather;
  forecast: Array<Forecast>;
  message: string;
}

export interface CurrentWeather {
  __typename?: 'CurrentWeather';
  time: number;
  summary: string;
  icon: string;
  nearestStormDistance: number;
  nearestStormBearing: number;
  precipntensity: number;
  precipProbability: number;
  temperature: number;
  apparentTemperature: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  ozone: number;
}

export interface Forecast {
  __typename?: 'Forecast';
  time: number;
  summary: string;
  icon: string;
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;
  precipntensity: number;
  precipntensityMax: number;
  precipntensityMaxTime: number;
  precipProbability: number;
  precipType: string;
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  apparentTemperatureHigh: number;
  apparentTemperatureHighTime: number;
  apparentTemperatureLow: number;
  apparentTemperatureLowTime: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windGustTime: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  uvIndexTime: number;
  visibility: number;
  ozone: number;
  temperatureMin: number;
  temperatureMinTime: number;
  temperatureMax: number;
  temperatureMaxTime: number;
  apparentTemperatureMin: number;
  apparentTemperatureMinTime: number;
  apparentTemperatureMax: number;
  apparentTemperatureMaxTime: number;
}

export interface SearchResult {
  __typename?: 'SearchResult';
  locations: Array<City>;
  crags: Array<Crag>;
  sectors: Array<Sector>;
  routes: Array<Route>;
  events: Array<Event>;
  competitions: Array<Competition>;
  news: Array<News>;
  places: Array<Place>;
  shelters: Array<Shelter>;
  hikes: Array<Hike>;
  pagination: Pagination;
}

export interface City {
  __typename?: 'City';
  name: string;
  coords: Coords;
}

export interface UserInfo {
  __typename?: 'UserInfo';
  geo: UserGeo;
}

export interface UserGeo {
  __typename?: 'UserGeo';
  isoCode: string;
  timeZone: string;
  city: string;
  sociald: string;
  socialConnection: string;
  firstName: string;
  lastName: string;
  coords: Coords;
}

export interface Subscription {
  __typename?: 'Subscription';
  onData: Notification;
}

export interface Notification {
  __typename?: 'Notification';
  id: string;
  data: string | null;
}
// tslint:enable
