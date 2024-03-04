import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

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
                   console.log(route.parent.data);
                    const service = new CrCoordonneeFactory();
                                const queryOptions: QueryOptions = new QueryOptions([
                                    {
                                        or: false, filters: [
                                            new Filter('id', route.paramMap.get('id'), 'eq'),
                                            new Filter('workspaces_id', route.parent.data.workspace.id, 'eq'),
                                        ]
                                    }
                                ]);

                                return service.list(queryOptions).pipe(
                                    map(data => {
                                        console.log(data);
                                        if (data && data.data.length) {
                                            this.coodService.coordonneeData = data.data[0];
                                            let foo = {};
                                            foo[data.data[0].id] = {'workspace':route.parent.data.workspace.id};
                                            return {
                                                parent: {
                                                    libelle: data.data[0].libelle,
                                                    id: foo
                                                },
                                                url: '/workspace/'+route.parent.data.workspace.id+'/'+route.paramMap.get('id')+'/bibliotheque'
                                            };
                                        }
                                        this.coodService.coordonneeData = null;
                                        return null;
                                    })
                                );
                }
            )
        )
    }


}
