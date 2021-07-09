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
  stories: Array<Story>;
  story: Story;
  competitions: ListResult;
  upcomingCompetitions: ListResult;
  competition: Competition;
  crags: ListResult;
  crag: Crag;

  /**
   * Returns debug information from the server
   */
  info: DebugInfo;
  events: ListResult;
  event: Event;
  forecast: ForecastResult;
  hikes: ListResult;
  hike: Hike;
  news: ListResult;
  oneNews: News;
  osmNodes: any;
  osmNode: any;
  photos: any;
  photosWeb: any;
  places: ListResult;
  googlePlaces: ListResult;
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
  userInfo: UserInfo;
  waveUser: UserInfo;
}

export interface StoriesOnQueryArguments {
  /**
   * @default 10
   */
  end?: number | null;

  /**
   * @default 0
   */
  start?: number | null;
}

export interface StoryOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface CompetitionsOnQueryArguments {
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
  distance?: number | null;

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
}

export interface CragOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface EventsOnQueryArguments {
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

export interface EventOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface ForecastOnQueryArguments {
  lng: number;
  lat: number;
}

export interface HikesOnQueryArguments {
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
  nodeId: string;
}

export interface PhotosOnQueryArguments {
  query: string;
}

export interface PhotosWebOnQueryArguments {
  query: string;
}

export interface PlacesOnQueryArguments {
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

export interface GooglePlacesOnQueryArguments {
  /**
   * @default 50
   */
  distance?: number | null;
  lng: number;
  lat: number;
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
   * @default 1
   */
  maxDifficulty?: number | null;

  /**
   * @default 0
   */
  minDifficulty?: number | null;

  /**
   * @default 1
   */
  maxPosition?: number | null;

  /**
   * @default 0
   */
  minPosition?: number | null;

  /**
   * @default 1
   */
  maxWeather?: number | null;

  /**
   * @default 0
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
   * @default 1
   */
  maxDifficulty?: number | null;

  /**
   * @default 0
   */
  minDifficulty?: number | null;

  /**
   * @default 1
   */
  maxPosition?: number | null;

  /**
   * @default 0
   */
  minPosition?: number | null;

  /**
   * @default 1
   */
  maxWeather?: number | null;

  /**
   * @default 0
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

export interface ShelterOnQueryArguments {
  slug?: string | null;
  id?: string | null;
}

export interface WaveUserOnQueryArguments {
  user: UserInfoInput;
}

export interface Story {
  __typename?: 'Story';
  _id: string;
  slug: string;
  pageTitle: string;
  description: string;
  thumbnailImage: string;
  coverImage: string;
  articles: Array<Article>;
  category: string;
  language: string;
  type: string | null;
}

export interface Article {
  __typename?: 'Article';
  title: string;
  shortDescription: string;
  image: string;
  body: string;
  coords: Coords;
  resourceUrl: string;
}

export interface Coords {
  __typename?: 'Coords';
  lat: number | null;
  lng: number | null;
}

export interface ListResult {
  __typename?: 'ListResult';
  items: Array<Item>;
  pagination: Pagination | null;
}

export type Item = Crag | Place | Event | Sector | Route | Competition | News | Shelter | Hike | Story;

export interface Crag {
  __typename?: 'Crag';
  _stats: CragStats | null;
  slug: string;
  title: string;
  descr: string | null;
  accessInfo: string | null;
  coords: Coords;
  altitude: number | null;
  exposition: string | null;
  boltingType: string | null;
  rockType: string | null;
  qualityRank: QualityRank;
  period: string | null;
  notes: string | null;
  resourceUrl: string;
  sectors: Array<Sector | null> | null;
  searchScore: number | null;
  type: string | null;
}

export interface CragStats {
  __typename?: 'CragStats';
  routesCount: number;
  sectorsCount: number;
}

export interface QualityRank {
  __typename?: 'QualityRank';
  score: number | null;
  crowdedness: number | null;
  weather: number | null;
  weatherExtended: Array<WeatherExtended> | null;
  position: number | null;
  difficulty: number | null;
  average: number | null;
  max: number | null;
  votes: number | null;
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
  parent: SectorCrag | null;
  slug: string;
  title: string;
  coords: Coords | null;
  notes: string | null;
  qualityRank: QualityRank | null;
  minGrade: string | null;
  maxGrade: string | null;
  resourceUrl: string;
  routes: Array<Route | null> | null;
  searchScore: number | null;
  type: string | null;
}

export interface SectorCrag {
  __typename?: 'SectorCrag';
  _stats: CragStats | null;
  slug: string | null;
  title: string | null;
  descr: string | null;
  accessInfo: string | null;
  coords: Coords | null;
  altitude: number | null;
  exposition: string | null;
  boltingType: string | null;
  rockType: string | null;
  qualityRank: QualityRank | null;
  period: string | null;
  notes: string | null;
  resourceUrl: string | null;
}

export interface Route {
  __typename?: 'Route';
  sector: string;
  parent: RouteSector | null;
  slug: string;
  seqNum: number | null;
  title: string;
  coords: Coords | null;
  grade: string | null;
  pitonsNum: number | null;
  length: number | null;
  routeType: string | null;
  gearType: string | null;
  notes: string | null;
  qualityRank: QualityRank | null;
  resourceUrl: string;
  searchScore: number | null;
  type: string | null;
}

export interface RouteSector {
  __typename?: 'RouteSector';
  crag: string | null;
  parent: SectorCrag | null;
  slug: string | null;
  title: string | null;
  coords: Coords | null;
  notes: string | null;
  qualityRank: QualityRank | null;
  minGrade: string | null;
  maxGrade: string | null;
  resourceUrl: string | null;
}

export interface Place {
  __typename?: 'Place';
  _id: string;
  socialId: string;
  slug: string;
  title: string;
  descr: string | null;
  coords: Coords;
  openings: Openings | null;
  notes: string | null;
  engagement: number | null;
  checkins: string | null;
  resourceUrl: string;
  searchScore: number | null;
  picture: string | null;
  type: string | null;
}

export interface Openings {
  __typename?: 'Openings';
  l: number | null;
}

export interface Event {
  __typename?: 'Event';
  socialId: string;
  slug: string;
  title: string;
  descr: string | null;
  coords: Coords;
  place: string | null;
  startTime: number | null;
  endTime: number | null;
  resourceUrl: string;
  searchScore: number | null;
  type: string | null;
}

export interface Competition {
  __typename?: 'Competition';
  coords: Coords;
  info: CompetitionInfo | null;
  people: Array<CompetitionPerson | null> | null;
  poster: string | null;
  resourceUrl: string;
  schedule: Array<string | null> | null;
  slug: string;
  startTime: number | null;
  endTime: number | null;
  title: string;
  searchScore: number | null;
  type: string | null;
}

export interface CompetitionInfo {
  __typename?: 'CompetitionInfo';
  categories: Array<string | null> | null;
  details: CompetitionDetails | null;
  place: string | null;
  specialties: Array<string | null> | null;
  types: Array<string | null> | null;
}

export interface CompetitionDetails {
  __typename?: 'CompetitionDetails';
  eventWebsite: string | null;
  infoSheet: string | null;
  text: string | null;
}

export interface CompetitionPerson {
  __typename?: 'CompetitionPerson';
  what: string | null;
  who: string | null;
}

export interface News {
  __typename?: 'News';
  media: NewsMedia | null;
  resourceUrl: string;
  slug: string;
  summary: string | null;
  title: string;
  lang: string;
  searchScore: number | null;
  creationTime: number;
  type: string | null;
}

export interface NewsMedia {
  __typename?: 'NewsMedia';
  thumb: string;
}

export interface Shelter {
  __typename?: 'Shelter';
  slug: string;
  title: string;
  descr: string | null;
  coords: Coords;
  accessInfo: string | null;
  altitude: string | null;
  opening: string | null;
  accomodationsFood: string | null;
  accomodationsRooms: string | null;
  beds: number | null;
  owners: string | null;
  keepers: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  web: string | null;
  facebook: string | null;
  media: Array<string | null> | null;
  searchScore: number | null;
  resourceUrl: string;
  type: string | null;
}

export interface Hike {
  __typename?: 'Hike';
  slug: string;
  title: string;
  trailLabel: string | null;
  difficulty: string | null;
  exposition: string | null;
  elevation: HikeElevation | null;
  grade: HikeGrade | null;
  length: number | null;
  startingPoint: string | null;
  accessInfo: string | null;
  notes: string | null;
  descr: string | null;
  coords: Coords;
  tracks: Array<string | null> | null;
  media: Array<string | null> | null;
  searchScore: number | null;
  resourceUrl: string;
  type: string | null;
}

export interface HikeElevation {
  __typename?: 'HikeElevation';
  asc: number | null;
  desc: number | null;
  low: number | null;
  high: number | null;
  ascDiffTot: number | null;
}

export interface HikeGrade {
  __typename?: 'HikeGrade';
  avg: number | null;
  max: number | null;
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
export interface DebugInfo {
  __typename?: 'DebugInfo';
  startedAt: number;
  version: string;
  name: string;
  uptime: number;
}

export interface ForecastResult {
  __typename?: 'ForecastResult';
  now: CurrentWeather;
  forecast: Array<Forecast>;
  message: string | null;
}

export interface CurrentWeather {
  __typename?: 'CurrentWeather';
  time: number | null;
  summary: string | null;
  icon: string | null;
  nearestStormDistance: number | null;
  nearestStormBearing: number | null;
  precipIntensity: number | null;
  precipProbability: number | null;
  temperature: number | null;
  apparentTemperature: number | null;
  dewPoint: number | null;
  humidity: number | null;
  pressure: number | null;
  windSpeed: number | null;
  windGust: number | null;
  windBearing: number | null;
  cloudCover: number | null;
  uvIndex: number | null;
  visibility: number | null;
  ozone: number | null;
}

export interface Forecast {
  __typename?: 'Forecast';
  time: number | null;
  summary: string | null;
  icon: string | null;
  sunriseTime: number | null;
  sunsetTime: number | null;
  moonPhase: number | null;
  precipIntensity: number | null;
  precipIntensityMax: number | null;
  precipIntensityMaxTime: number | null;
  precipProbability: number | null;
  precipType: string | null;
  temperatureHigh: number | null;
  temperatureHighTime: number | null;
  temperatureLow: number | null;
  temperatureLowTime: number | null;
  apparentTemperatureHigh: number | null;
  apparentTemperatureHighTime: number | null;
  apparentTemperatureLow: number | null;
  apparentTemperatureLowTime: number | null;
  dewPoint: number | null;
  humidity: number | null;
  pressure: number | null;
  windSpeed: number | null;
  windGust: number | null;
  windGustTime: number | null;
  windBearing: number | null;
  cloudCover: number | null;
  uvIndex: number | null;
  uvIndexTime: number | null;
  visibility: number | null;
  ozone: number | null;
  temperatureMin: number | null;
  temperatureMinTime: number | null;
  temperatureMax: number | null;
  temperatureMaxTime: number | null;
  apparentTemperatureMin: number | null;
  apparentTemperatureMinTime: number | null;
  apparentTemperatureMax: number | null;
  apparentTemperatureMaxTime: number | null;
}

export interface SearchResult {
  __typename?: 'SearchResult';
  locations: Array<City | null> | null;
  crags: Array<Crag>;
  sectors: Array<Sector>;
  routes: Array<Route>;
  events: Array<Event>;
  competitions: Array<Competition>;
  news: Array<News | null> | null;
  places: Array<Place>;
  shelters: Array<Shelter>;
  hikes: Array<Hike>;
  pagination: Pagination | null;
}

export interface City {
  __typename?: 'City';
  name: string;
  coords: Coords;
}

export interface UserInfo {
  __typename?: 'UserInfo';
  userGeo: UserGeo;
  socialId: string | null;
  socialConnection: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface UserGeo {
  __typename?: 'UserGeo';
  isoCode: string;
  timeZone: string;
  city: string;
  coords: Coords;
}

export interface UserInfoInput {
  socialId?: string | null;
  socialConnection?: string | null;
  firstName?: string | null;
  lastName?: string | null;
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
