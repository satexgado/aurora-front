import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { first, map, single, switchMap, take } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { CoordonneeDetailsService } from '../coordonnee-details.service'
import { ICrCoordonnee } from '../../../../core/models/gestion-courrier/cr-coordonnee';
import { CrCourrierSortantFactory } from '../../../../core/services/gestion-courrier/cr-courrier-sortant';

@Injectable()
export class CoodCourrierSortantResolver implements Resolve<Observable<any>> {

    constructor(protected cacheService: CacheService, protected coodService: CoordonneeDetailsService) {
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

                    if((route.parent.parent.data.coordonnee.coordonnee))
                    {
                        queryOptions.filter_groups[0].filters.push(new Filter('DestinataireId', route.parent.parent.data.coordonnee.coordonnee.id,  'eq'));
                    }

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
