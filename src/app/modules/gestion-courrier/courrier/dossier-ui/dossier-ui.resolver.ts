import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { first, map, single, switchMap, take } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { CrDossierFactory } from 'src/app/core/services/gestion-courrier/cr-dossier';

@Injectable()
export class DossierUiResolver implements Resolve<Observable<any>> {

    constructor(protected cacheService: CacheService) {
    }

    resolve( route: ActivatedRouteSnapshot ) {
      const service = new CrDossierFactory();
      const queryOptions: QueryOptions = new QueryOptions([
          {or: false, filters: [
              new Filter('id', route.paramMap.get('id') , 'eq')
          ]},
      ]);

      return service.list(queryOptions).pipe(
          map(data => {
              if (data && data.data.length) {
                  return data.data[0];
              }
              return null;
          })
      );
    }


}
