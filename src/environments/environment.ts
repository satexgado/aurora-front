// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: true,
//   api_url: 'https://backend.sigecam.org/public/api',
//   apiUrl: 'https://backend.sigecam.org/public/api',
//   baseUrl: 'https://backend.sigecam.org/public',
//   clientSecret: 'yEcYglyRaOqwKGGf61lRLuhuvhNGPVeveMYFhRA9',
//   clientId: 2,
//   grantType: 'password',
//   pusher: {
//     key: 'c5f7fa11fa408596306f',
//     cluster: 'eu',
//   },
//   storageUrl: 'https://backend.sigecam.org/public/storage/',
//   imageUrl: 'https://backend.sigecam.org/public/storage/',
// };

export const environment = {
  production: false,
  api_url: 'http://127.0.0.1:8000/api',
  apiUrl: 'http://127.0.0.1:8000/api',
  baseUrl: 'http://127.0.0.1:8000',
  clientSecret: 'yEcYglyRaOqwKGGf61lRLuhuvhNGPVeveMYFhRA9',
  clientId: 2,
  grantType: 'password',
  pusher: {
    key: 'c5f7fa11fa408596306f',
    cluster: 'eu',
  },
  storageUrl: 'http://localhost:8000/storage/',
  imageUrl: 'http://localhost:8000/storage/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
