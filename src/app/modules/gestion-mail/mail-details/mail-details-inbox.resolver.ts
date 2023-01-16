import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { map } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
import { CrMailFactory } from 'src/app/core/services/gestion-courrier/cr-mail';

@Injectable()
export class MailDetailsInboxResolver implements Resolve<Observable<ICrMail>> {
  constructor(protected cacheService: CacheService) {
  }

  resolve( route: ActivatedRouteSnapshot ) {
    const service = new CrMailFactory();
    const queryOptions: QueryOptions = new QueryOptions([
      {or: false, filters: [
          new Filter('id', route.paramMap.get('id') , 'eq'),
          new Filter('inbox_ins', true, 'eq')
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
