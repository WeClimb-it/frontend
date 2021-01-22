import { get } from 'lodash';

import { Competition } from '../interfaces/graphql';

/**
 * Returns sanitized properties for a given competition item.
 */
export const getSanitizedCompetitionProperties = (
  item: Competition,
): {
  disputed: boolean;
  types: string[];
  specialties: string[];
  categories: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
} => {
  // TODO: Waiting the crawler to be fixed, we have to filter here some bad data
  return {
    disputed: new Date(item.startTime) <= new Date(),
    types: get(item, 'info.types').filter((str: string) => str !== ''),
    specialties: get(item, 'info.specialties').filter((str: string) => str !== ''),
    categories: get(item, 'info.categories').filter((str: string) => str !== ''),
    startDate: item.startTime ? new Date(item.startTime) : undefined,
    endDate: item.endTime ? new Date(item.endTime) : undefined,
  };
};
