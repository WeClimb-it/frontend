import { Injectable } from '@angular/core';

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { environment } from 'src/environments/environment';
import { getEntityCacheId } from '../utils/Poi';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class ApolloService {
  public client: ApolloClient<NormalizedCacheObject>;

  private userSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  constructor() {}

  public init(): void {
    const cache = new InMemoryCache({
      // Why this? B/c in certain cases we need an expanded version of the GraphQL item (i.e. crag with sectors)
      // since the same item might be loaded somewhere else w/o expanded props (i.e. sectors) and thus stored in the cache,
      // this would override the already cached item.
      // In such a case we create an ad-hoc cache key prepending the "deep" label.
      dataIdFromObject: getEntityCacheId,
    });

    const userLangMiddleware = new ApolloLink((operation, forward) => {
      if (typeof forward === 'undefined') {
        throw new Error('forward is undefined');
      }

      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          'x-lang': I18nService.userLang,
        },
      }));

      return forward(operation);
    });

    const userSessionIdMiddleware = new ApolloLink((operation, forward) => {
      if (typeof forward === 'undefined') {
        throw new Error('forward is undefined');
      }

      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          'x-sessid': this.userSessionId,
        },
      }));

      return forward(operation);
    });

    this.client = new ApolloClient({
      cache,
      ssrMode: false,
      queryDeduplication: false,
      link: ApolloLink.from([
        // new RetryLink() as any,
        userSessionIdMiddleware,
        userLangMiddleware,
        new HttpLink({ uri: environment.graphql.url }),
      ]),
    });
  }
}
