// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  graphql: {
    url: 'http://localhost:3000/graphql',
  },
  rest: {
    url: 'http://localhost:3000/static',
  },
  i18n: {
    defaultLang: 'en',
    availableLangs: ['it', 'en'],
    availableLangsLabels: ['Italiano', 'English'],
  },
  mapbox: {
    // Don't worry, referrers are white-listed ;-)
    token: 'pk.eyJ1Ijoid2VjbGltYml0IiwiYSI6ImNrNzlha3B0YzA4aWgzbXJ6dDQ1ZXF4dWEifQ.NX6j-UOi0l9Ut3o-77FA4w',
    style: 'mapbox://styles/weclimbit/ck76qiur612ur1imof17kauyo?optimize=true',
    styleTerrain: 'mapbox://styles/weclimbit/ckq3k5yvg0i2e18nqrqpwu7rn?optimize=true',
    styleLight: 'mapbox://styles/weclimbit/ckqxksvbb3xtl17mcs40bto4d?optimize=true',
  },
  facebookAppId: '253345021488136',
  facebookScopes: 'email,public_profile', // comma separated
  googleAnalyticsID: 'UA-40003077-1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';
