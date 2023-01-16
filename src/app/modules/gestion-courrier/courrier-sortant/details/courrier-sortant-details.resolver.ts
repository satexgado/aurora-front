import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { CrCourrierSortantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-sortant';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { Filter } from 'src/app/shared/models/query-options';
import { map } from 'rxjs/operators';

@Injectable()
export class CourrierSortantDetailsResolver implements Resolve<Observable<ICrCourrierSortant>> {
  constructor(private service: CrCourrierSortantFactory) {}

  resolve( route: ActivatedRouteSnapshot ) {

    const queryOptions = new QueryOptions([
        {or: false, filters: [
            new Filter('id', route.paramMap.get('id') , 'eq')
        ]},
    ],[
      'cr_courrier.cr_type',
      'cr_courrier.cr_nature',
      'cr_courrier.cr_urgence',
      'cr_courrier.cr_statut',
      'cr_destinataires.cr_coordonnee',
      'cr_ampiliations.cr_coordonnee',
      'cr_courrier.cr_cloture'
    ]);

    return this.service.list(queryOptions).pipe(
        map(data => {
            if (data && data.data.length) {
                return data.data[0] as ICrCourrierSortant;
            }
            return null;
        })
    );
  }
}
