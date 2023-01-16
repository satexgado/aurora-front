import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Storage } from 'src/app/helpers/storage/storage';
import { environment } from 'src/environments/environment';

const pusher = new Pusher(environment.pusher.key, {
  cluster: environment.pusher.cluster,
  forceTLS: true,

  authEndpoint: `${environment.baseUrl}/broadcasting/auth`,
  auth: {
    headers: { Authorization: `Bearer ${new Storage().getAccessToken()}` },
  },
});

export const echo = new Echo({
  broadcaster: 'pusher',
  client: pusher,
  key: environment.pusher.key,
  encrypted: true,
});
