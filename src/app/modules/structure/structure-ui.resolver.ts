import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { first, map, single, switchMap, take } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { StructureUiService } from './structure-ui.service';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';

@Injectable()
export class StructureUiResolver implements Resolve<Observable<any>> {

    constructor(protected cacheService: CacheService, protected structureUiService: StructureUiService) {
    }

    resolve( route: ActivatedRouteSnapshot ) {
        return this.structureUiService.structure$.pipe(
            first(),
            switchMap(
                (data)=>{
                    if(data && data.id == +route.paramMap.get('id')  ) {
                        return of(data);
                    }


                    const service = new StructureService();
                    return service.show(+route.paramMap.get('id')).pipe(
                        map(data => {
                            if (data) {
                                this.structureUiService.structure = data;
                                return data;
                            }
                            this.structureUiService.structure = null;
                            return null;
                        })
                    );
                    
                }
            )
        )
    }


}
