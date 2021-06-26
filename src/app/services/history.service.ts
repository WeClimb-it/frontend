import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { Poi } from '../utils/Poi';
import { AppStoreService } from './appState.service';
import { PersistanceService } from './persistanceService';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  entities: Poi[] = [];

  constructor(private appStore: AppStoreService) {
    this.entities = (PersistanceService.get('history') as Poi[]) || [];
  }

  addToHistory(entity: Poi): void {
    if (!find(this.entities, entity)) {
      this.entities.push(entity);
      this.appStore.setProperty('history', this.entities, true);
    }
  }

  clear(): void {
    this.entities = [];
    this.appStore.unsetProperty('history');
  }
}
