import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Observable } from 'rxjs';
import { map, switchAll, switchMap } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { Filter, QueryOptions } from 'src/app/shared/models/query-options';
import { IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { GedWorkspaceCoordonneeFactory } from 'src/app/core/services/gestion-document/ged-workspace-coordonnee.factory';

@Injectable()
export class GedWorkspaceCoordonneeResolver implements Resolve<Observable<any>> {
  constructor(protected cacheService: CacheService, public authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot) {

    return route.parent.data.pipe(
      switchMap(
        (parent_data: { workspace: IGedWorkspace }) => {
          let service = new GedWorkspaceCoordonneeFactory();
          const queryOptions: QueryOptions = new QueryOptions([
            {
              or: false, filters: [
                new Filter('id', route.paramMap.get('id'), 'eq'),
                new Filter('workspace_id', parent_data.workspace.id, 'eq'),
              ]
            },
          ]).setIncludes(['cr_coordonnee']);
          return service.list(queryOptions).pipe(
            map(data => {
              if (data && data.data.length) {
                return {
                  parent: data.data[0],
                  url: `/workspace/${parent_data.workspace.id}/${route.paramMap.get('id')}`
                };
              }
              return null;
            })
          );
        }
      )
    );

    
  }
}
