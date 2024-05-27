// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const env = {
    protocol: 'http',
    domain: 'localhost',
    app: ''
};

export const environment = {
    production: false,

    urlMetaRestaurante: 'https://metagaleria.ajamam.es',
    serverSsrPort: 8074,
    domain: `${env.domain}`,
    domainUrl: `${env.protocol}://${env.app}${env.domain}`,
    urlEndPoint: `${env.protocol}://${env.app}${env.domain}:8081`,
    googleAnalyticsId: '8SCFLYHJBQ'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
