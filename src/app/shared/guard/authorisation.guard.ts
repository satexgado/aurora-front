import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot, Route, CanLoad } from '@angular/router';
import { Helper } from '../../helpers/helper/helper';
import { NotificationService } from '../notification';

@Injectable({ providedIn: 'root' })
export class AuthorisationGuardService implements CanActivate, CanLoad {
    guards: {scope: string, access: 'LECTURE' | 'ECRITURE'}[];
  constructor(private _router:Router, public helper: Helper, private notification: NotificationService ) {      
  }      
 
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
                if(!(route.routeConfig?.data&&route.routeConfig?.data?.guards)) {
                    return true;
                }
                this.guards = route.routeConfig?.data?.guards;
                for(let guard in this.guards) {
                    if(this.helper.authorisation.check(this.guards[guard].scope, this.guards[guard].access, undefined)) {
                        return true;
                    }
                }
               
     this.notification.onError("Vous n'êtes pas autorisé à voir cette page. Vous êtes rediriger vers la page d'acceul"); 
     this._router.navigate([""]);             
     return false;     
    } 

    canLoad(route: Route): boolean {
    
        if(!(route.data&&route.data?.guards)) {
            return true;
        }
        this.guards = route.data?.guards;
        for(let guard in this.guards) {
            if(this.helper.authorisation.check(this.guards[guard].scope, this.guards[guard].access, undefined)) {
                return true;
            }
        }
        this.notification.onError("Vous n'êtes pas autorisé à voir cette page. Vous êtes rediriger vers la page d'acceul"); 
        this._router.navigate([""]);             
        return false;  
     
      }

}