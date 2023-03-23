import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { UsersService } from 'src/app/express-courrier/users/users.service';

@Injectable()
export class UserDetailsResolver implements Resolve<Observable<any>> {
  constructor(public userService: UsersService) {}

  resolve( route: ActivatedRouteSnapshot ) {
    return  this.userService.show(+route.paramMap.get('id'))
  }
}
