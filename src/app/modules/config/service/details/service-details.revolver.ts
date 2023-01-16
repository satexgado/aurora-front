import { IService } from 'src/app/core/models/service.model';
import { ServiceFactory } from 'src/app/core/services/service.factory';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { Filter } from 'src/app/shared/models/query-options';
import { map } from 'rxjs/operators';
@Injectable()
export class ServiceDetailsResolver implements Resolve<Observable<IService>> {
  constructor(private service: ServiceFactory) {}

  resolve( route: ActivatedRouteSnapshot ) {

    const queryOptions = new QueryOptions([
        {or: false, filters: [
            new Filter('isIns', true, 'eq'),
            new Filter('id_services', route.paramMap.get('id') , 'eq')
        ]},
    ],['visi_type_service']);

    return this.service.list(queryOptions).pipe(
        map(data => {
            if (data && data.data.length) {
                return data.data[0] as IService;
            }
            return null;
        })
    );
  }
}
