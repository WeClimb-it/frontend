import { Injectable } from '@angular/core';
import { SimpleStateService } from 'ngx-simple-state';

export enum StateProperties {
  CURRENT_LOCATION = 'wci.currentLocation',
  CURRENT_USER_LOCATION = 'wci.currentUserLocation',
  USER = 'wci.user',
  USER_AVATAR = 'wci.socialUserPicture',
  USE_METRIC_SYSTEM = 'wci.useMetricSystem',
  HISTORY = 'wci.history',
  SEARCH_OPTIONS = 'wci.searchOptions',
  LANG = 'wci.lang',
  SOCIAL_USER_ID = 'wci.socialUserId',
  SOCIAL_USER_TOKEN = 'wci.socialUserToken',
  SOCIAL_USER_PICTURE = 'wci.socialUserPicture',
  MAP_CENTER = 'wci.mapCenter',
  USE_GEOLOC = 'wci.geoloc',
  SHOW_BOTTOM_SHEET = 'wci.bottomSheet',
}

@Injectable({ providedIn: 'root' })
export class StateService {
  app: SimpleStateService = new SimpleStateService();
}
