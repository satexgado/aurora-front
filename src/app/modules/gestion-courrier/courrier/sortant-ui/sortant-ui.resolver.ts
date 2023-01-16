import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { first, map, switchMap } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { CrCourrierSortantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-sortant';
import { CourrierUiService } from '../courrier-ui.service'

@Injectable()
export class CourrierSortantUiResolver implements Resolve<Observable<any>> {

    constructor(protected cacheService: CacheService, protected coodService: CourrierUiService) {
    }

    resolve( route: ActivatedRouteSnapshot ) {
        return this.coodService.courrierSortantData$.pipe(
            first(),
            switchMap(
                (data)=>{
                    if(data && data.id == +route.paramMap.get('id')  ) {
                        return of(data);
                    }

                    // let filter = route.parent.routeConfig.data && route.parent.routeConfig.data[ 'filter' ] ? route.parent.routeConfig.data[ 'filter' ] : new Filter('inbox_ins', true, 'eq');

                    const service = new CrCourrierSortantFactory();
                    const queryOptions: QueryOptions = new QueryOptions([
                        {or: false, filters: [
                            new Filter('id', route.paramMap.get('id') , 'eq')
                        ]},
                        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]}
                    ]);

                    return service.list(queryOptions).pipe(
                        map(data => {
                            if (data && data.data.length) {
                                this.coodService.courrierSortantData = data.data[0];
                                return data.data[0];
                            }
                            this.coodService.courrierSortantData = null;
                            return null;
                        })
                    ); 
                }
            )
        )
    }

}
