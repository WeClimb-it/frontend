import { Coords } from './graphql';

export interface HistoryItem {
  title: string;
  descr: string;
  coords: Coords;
  internalLink: string;
}
