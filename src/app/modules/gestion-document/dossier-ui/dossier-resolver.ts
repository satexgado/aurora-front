import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { map } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { Dossier } from 'src/app/core/models/gestion-document/dossier.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';

@Injectable()
export class ZenDossierResolver implements Resolve<Observable<Dossier>> {
  constructor(protected cacheService: CacheService) {
  }

  resolve( route: ActivatedRouteSnapshot ) {
    const service = new DossierFactory();
    const queryOptions: QueryOptions = new QueryOptions([
      {or: false, filters: [
          new Filter('id', route.paramMap.get('id') , 'eq')
      ]},
    ], ['dossier', 'inscription', 'ged_element']);

    if(route.routeConfig.data[ 'additionnal_filter' ]) {
      queryOptions.filter_groups.push(
        route.routeConfig.data[ 'additionnal_filter' ]
      )
    }

    if(route.routeConfig.data['folder_parent']) {
      queryOptions.filter_groups.push(
        {or: false, filters: [
          new Filter(route.routeConfig.data['folder_parent'], route.parent.paramMap.get('id'), 'eq')
        ]}
      )
    }

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
