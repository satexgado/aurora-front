import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';

@Injectable()
export class ZenStructureResolver implements Resolve<Observable<any>> {
  constructor(protected cacheService: CacheService, public authService: AuthService,protected service: StructureService) {
  }

  resolve( route: ActivatedRouteSnapshot ) {
    return this.service.getByUser(this.authService.user.id).pipe(
      map((data)=> {
        let parentData = null;
        let url = '/document/structure';

        if(route.paramMap.get('id')) {
          let filtered= data.data.filter(element=>element?.id==route.paramMap.get('id'));
          parentData = filtered.length ? filtered[0] : null;
          url += '/'+route.paramMap.get('id');
        };

        return {
          structures: data.data.sort((n1,n2) => n1.libelle > n2.libelle),
          parent: parentData,
          url: url
        }
      }
    ));
  }
}
