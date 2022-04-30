import { Injectable } from '@angular/core';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { getEntityCacheId } from './utils/Poi';

export interface ApolloServiceOptions {
  useLoginMiddleware: boolean;
  lang: string;
  graphql: {
    uri: string;
  };
  loginMiddlewareOptions?: {
    socialUserId: string;
    socialUserToken: string;
  };
}

const defaultOptions = { useLoginMiddleware: false, lang: 'us', graphql: { uri: 'localhost' } };

@Injectable({ providedIn: 'root' })
export class ApolloService {
  client: ApolloClient<NormalizedCacheObject>;

  private userSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  private options: ApolloServiceOptions = defaultOptions;

  userLoginMiddleware() {
    return new ApolloLink((operation, forward) => {
      if (typeof forward === 'undefined') {
        throw new Error('forward is undefined');
      }

      if (!this.options.loginMiddlewareOptions) {
        throw new Error('Cannot init the Login middleware without options');
      }

      const userId = this.options.loginMiddlewareOptions.socialUserId;
      const userToken = this.options.loginMiddlewareOptions.socialUserToken;

      if (userId && userToken) {
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            'x-usid': userId,
            'x-utkn': userToken,
          },
        }));
      }

      return forward(operation);
    });
  }

  init(options: ApolloServiceOptions): void {
    this.options = options;

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
          'x-lang': this.options.lang,
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

    let apolloLinks = [userSessionIdMiddleware, userLangMiddleware, new HttpLink({ uri: this.options.graphql.uri })];

    if (this.options.useLoginMiddleware) {
      apolloLinks = [this.userLoginMiddleware(), ...apolloLinks];
    }

    this.client = new ApolloClient({
      cache,
      ssrMode: false,
      queryDeduplication: false,
      link: ApolloLink.from(apolloLinks),
    });
  }
}
