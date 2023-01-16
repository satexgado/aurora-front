import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { first, map, switchMap } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { CoordonneeDetailsService } from '../coordonnee-details.service'
import { MpMarcheFactory } from 'src/app/core/services/marche-public/marche.model';

@Injectable()
export class CoodMarchePublicResolver implements Resolve<Observable<any>> {

    constructor(protected cacheService: CacheService, protected coodService: CoordonneeDetailsService) {
    }

    resolve( route: ActivatedRouteSnapshot ) {
        return this.coodService.marchePublicData$.pipe(
            first(),
            switchMap(
                (data)=>{
                    if(data && data.id == +route.paramMap.get('id')  ) {
                        return of(data);
                    }

                    // let filter = route.parent.routeConfig.data && route.parent.routeConfig.data[ 'filter' ] ? route.parent.routeConfig.data[ 'filter' ] : new Filter('inbox_ins', true, 'eq');

                    const service = new MpMarcheFactory();
                    const queryOptions: QueryOptions = new QueryOptions([
                        {or: false, filters: [
                            new Filter('id', route.paramMap.get('id') , 'eq')
                        ]},
                    ],[
                        'mp_type_marche', 'structure', 'mp_type_procedure.mp_type_procedure', 'mp_marche_etapes.fichiers', 'fournisseurs', 'partenaires'
                    ]);

                    if((route.parent.parent.data.coordonnee.coordonnee))
                    {
                        queryOptions.filter_groups.push(
                            {or: true, filters: [
                                new Filter('CoordonneeId', route.parent.parent.data.coordonnee.coordonnee.id,  'eq'),
                            ]}
                        );
                    }

                    return service.list(queryOptions).pipe(
                        map(data => {
                            if (data && data.data.length) {
                                this.coodService.marchePublicData = data.data[0];
                                return data.data[0];
                            }
                            this.coodService.marchePublicData = null;
                            return null;
                        })
                    );
                    
                }
            )
        )
    }


}
