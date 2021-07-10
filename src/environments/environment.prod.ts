export const environment = {
  production: true,
  graphql: {
    url: 'https://api.weclimb.it/graphql',
  },
  rest: {
    url: 'https://api.weclimb.it/static',
  },
  i18n: {
    defaultLang: 'en',
    availableLangs: ['it', 'en'],
    availableLangsLabels: ['Italiano', 'English'],
  },
  mapbox: {
    // Don't worry, referrers are white-listed ;-)
    token: 'pk.eyJ1Ijoid2VjbGltYml0IiwiYSI6ImNrOGtlZ2lvdzAwdW8zZ25vbjUxbHIycnAifQ.lwM-V6-SoRqiTWLWMEWDzw',
    style: 'mapbox://styles/weclimbit/ck76qiur612ur1imof17kauyo?optimize=true',
    styleTerrain: 'mapbox://styles/weclimbit/ckq3k5yvg0i2e18nqrqpwu7rn?optimize=true',
    styleLight: 'mapbox://styles/weclimbit/ckqxksvbb3xtl17mcs40bto4d?optimize=true',
  },
  facebookAppId: '253345021488136',
  facebookScopes: 'email,public_profile', // comma separated
  googleAnalyticsID: 'UA-40003077-1',
};
