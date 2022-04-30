import { InjectionToken } from '@angular/core';
import { ApolloServiceOptions } from './apollo.service';

export const WCI_API_SERVICE_OPTIONS = new InjectionToken<ApolloServiceOptions>('wci-api-service-options');
