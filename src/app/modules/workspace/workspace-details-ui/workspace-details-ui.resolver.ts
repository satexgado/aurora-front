import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { first, map, single, switchMap, take } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { WorkspaceUiService } from '../workspace.service';
import { GedWorkspaceCoordonneeFactory } from 'src/app/core/services/gestion-document/ged-workspace-coordonnee.factory';
import { IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';

@Injectable()
export class GedWorkspaceDetailsUiResolver implements Resolve<Observable<any>> {

    constructor(protected cacheService: CacheService, protected coodService: WorkspaceUiService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        return this.coodService.coordonneeData$.pipe(
            first(),
            switchMap(
                (data) => {
                    if (data && data.id == +route.paramMap.get('id')) {
                        return of(data);
                    }
                    return route.parent.data.pipe(
                        switchMap(
                            (parent_data: { workspace: IGedWorkspace }) => {
                                // let filter = route.parent.routeConfig.data && route.parent.routeConfig.data[ 'filter' ] ? route.parent.routeConfig.data[ 'filter' ] : new Filter('inbox_ins', true, 'eq');
                                const service = new CrCoordonneeFactory();
                                const queryOptions: QueryOptions = new QueryOptions([
                                    {
                                        or: false, filters: [
                                            new Filter('id', route.paramMap.get('id'), 'eq'),
                                            new Filter('workspace_id', parent_data.workspace.id, 'eq'),
                                        ]
                                    },
                                    { or: false, filters: [new Filter('IsIns2', 1, 'eq')] }
                                ]).setIncludes(['cr_coordonnee']);

                                return service.list(queryOptions).pipe(
                                    map(data => {
                                        if (data && data.data.length) {
                                            this.coodService.coordonneeData = data.data[0];
                                            return data.data[0];
                                        }
                                        this.coodService.coordonneeData = null;
                                        return null;
                                    })
                                );
                            })
                    )
                }
            )
        )
    }


}
