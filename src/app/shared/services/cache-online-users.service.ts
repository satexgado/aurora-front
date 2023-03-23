import { Injectable } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import * as moment from 'moment';
import { AppInjector } from './app-injector.service';

@Injectable({
  providedIn: 'root',
})
export class CacheOnlineUsers {
    private readonly transferState: TransferState;
    public authService: AuthService;
    constructor(
        
    ) {
        const injector = AppInjector.getInjector();
        this.authService = injector.get(AuthService);
        this.transferState = injector.get(TransferState);
    }

    public handle() {
        const ONLINE_USERS_KEY = makeStateKey<{user,last_activity_at}[]>('online-users');

        // This works only if users are logged in
        if(this.authService.isLoggedIn()) {
            // Get the array of users from the cache
           let users = this.transferState.get(ONLINE_USERS_KEY,null);
             // If it's empty create it with the user who triggered this middleware call
             if(!(users && users.length)) {
                this.transferState.set(ONLINE_USERS_KEY, [
                    {'user': this.authService.user, 'last_activity_at': new Date()},
                ]);
            } else {
                // Otherwise iterate over the users stored in the cache array
                // If the current iteration matches the logged in user, unset it because it's old
                // and we want only the last user interaction to be stored (and we'll store it below)
                // If the user's last activity was more than 10 minutes ago remove it

                const filteredList = users.filter(item1 => 
                    !((item1.user.id == this.authService.user.id) ||
                    (
                        moment(item1.last_activity_at).diff(moment(new Date()), 'minute') > 10
                    ))
                );
                // Add this last activity to the cache array

                filteredList.push(
                    {'user': this.authService.user, 'last_activity_at': new Date()}
                );
                // Put this array in the cache

                this.transferState.set(ONLINE_USERS_KEY, filteredList);
            }
        }

        return this.transferState.get(ONLINE_USERS_KEY,null);
    }


}
