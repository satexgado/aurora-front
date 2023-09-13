import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { GedDossierAdministratif, IGedDossierAdministratif } from 'src/app/core/models/gestion-document/ged-dossier-administratif.model';
import { GedDossierAdministratifFactory } from 'src/app/core/services/gestion-document/ged-dossier-administratif.factory';
import { Filter, QueryOptions } from 'src/app/shared/models/query-options';

@Injectable()
export class GedDossierAdministratifResolver implements Resolve<Observable<any>> {
  constructor(protected cacheService: CacheService, public authService: AuthService) {
  }

  resolve( route: ActivatedRouteSnapshot ) {
    let service = new GedDossierAdministratifFactory();

    const queryOptions: QueryOptions = new QueryOptions([
      {or: false, filters: [
          new Filter('id', route.paramMap.get('id') , 'eq')
      ]},
    ]);
    
    return service.list(queryOptions).pipe(
      map(data => {
          if (data && data.data.length) {
              return {
                parent: data.data[0],
                url: '/document/dossier-administratif'+'/'+route.paramMap.get('id')
              };
          }
          return null;
      })
  );
  }
}
