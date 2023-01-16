import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { first, map, single, switchMap, take } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
import { CrMailFactory } from 'src/app/core/services/gestion-courrier/cr-mail';
import { MailInterneService } from './interne.service';

@Injectable()
export class MailInterneResolver implements Resolve<Observable<ICrMail>> {

    constructor(protected cacheService: CacheService, protected mailInterneService: MailInterneService) {
    }

    resolve( route: ActivatedRouteSnapshot ) {
        return this.mailInterneService.mailData$.pipe(
            first(),
            switchMap(
                (data)=>{
                    if(data && data.id == +route.paramMap.get('id')  ) {
                        return of(data);
                    }

                    let filter = route.parent.routeConfig.data && route.parent.routeConfig.data[ 'filter' ] ? route.parent.routeConfig.data[ 'filter' ] : new Filter('inbox_ins', true, 'eq');

                    const service = new CrMailFactory();
                    const queryOptions: QueryOptions = new QueryOptions([
                      {or: false, filters: [
                          new Filter('id', route.paramMap.get('id') , 'eq'),
                          filter
                      ]},
                    ]);


                    return service.list(queryOptions).pipe(
                        map(data => {
                            if (data && data.data.length) {
                                this.mailInterneService.mailData = data.data[0];
                                return data.data[0];
                            }
                            this.mailInterneService.mailData = null;
                            return null;
                        })
                    );
                }
            )
        )
    }


}
