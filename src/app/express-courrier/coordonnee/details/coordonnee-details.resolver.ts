import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { Filter } from 'src/app/shared/models/query-options';
import { map } from 'rxjs/operators';

@Injectable()
export class CoordonneeDetailsResolver implements Resolve<Observable<ICrCoordonnee>> {
  constructor(private service: CrCoordonneeFactory) {}

  resolve( route: ActivatedRouteSnapshot ) {

    const queryOptions = new QueryOptions([
        {or: false, filters: [
            new Filter('id', route.paramMap.get('id') , 'eq')
        ]},
    ],['cr_coordonnee_groupes']);

    return this.service.list(queryOptions).pipe(
        map(data => {
            if (data && data.data.length) {
                return data.data[0] as ICrCoordonnee;
            }
            return null;
        })
    );
  }
}
