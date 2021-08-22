import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { Poi } from '../utils/Poi';
import { StateProperties, StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  entities: Poi[] = [];

  constructor(private state: StateService) {
    this.entities = this.state.app.getProperty(StateProperties.HISTORY) || [];
  }

  addToHistory(entity: Poi): void {
    if (!find(this.entities, entity)) {
      this.entities.push(entity);
      this.state.app.setProperty(StateProperties.HISTORY, this.entities, true);
    }
  }

  clear(): void {
    this.entities = [];
    this.state.app.unsetProperty(StateProperties.HISTORY);
  }
}
