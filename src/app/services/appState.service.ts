// TODO: Instead of using hard-coded string as keys, provide a enum or something

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistanceService } from './persistanceService';

@Injectable({ providedIn: 'root' })
export class AppStoreService {
  private readonly state: { [key: string]: BehaviorSubject<unknown> } = {};

  /**
   *
   */
  getProperty(key: string): unknown {
    return this.state[key]?.getValue();
  }

  /**
   *
   */
  watchProperty(key: string, defaultValue?: unknown): Observable<unknown> {
    const persistedValue = PersistanceService.get(key);

    if (!this.state[key]) {
      this.state[key] = new BehaviorSubject<unknown>(defaultValue || persistedValue);
    }

    return this.state[key].asObservable();
  }

  /**
   *
   */
  setProperty(key: string, value: unknown, persist = false): void {
    if (this.state[key]) {
      this.state[key].next(value);
    } else {
      this.state[key] = new BehaviorSubject<unknown>(value);
    }

    if (persist) {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      PersistanceService.set(key, String(value));
    }
  }

  /**
   *
   */
  unsetProperty(key: string): void {
    if (this.state[key]) {
      this.state[key].next(undefined);
      PersistanceService.unset(key);
    }
  }
}
