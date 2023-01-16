import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}

    canLoad(router: Route): boolean {
      let url: string = router.path;
      if (this.authService.isUserLoggedIn()) {
         return true; 
      }
          this.authService.setRedirectUrl(url);
          this.router.navigate([ this.authService.getLoginUrl() ]);
          return false;		
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      let url: string = state.url;
          if (this.authService.isUserLoggedIn()) {
            return true; 
          }
      this.authService.setRedirectUrl(url);
      this.router.navigate([ this.authService.getLoginUrl() ]);
          return false;
    }  	

    canActivateChild(route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }

}