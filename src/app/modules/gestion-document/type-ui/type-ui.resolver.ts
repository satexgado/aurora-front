import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/shared/services';
import { IFichierType } from 'src/app/core/models/gestion-document/fichier-type.model';
import { FichierTypeFactory } from 'src/app/core/services/gestion-document/fichier-type.factory';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { map, shareReplay } from 'rxjs/operators';

@Injectable()
export class ZenDocumentTypeUiResolver implements Resolve<Observable<IFichierType>> {
  constructor(protected cacheService: CacheService, public authService: AuthService) {
  }

  resolve( route: ActivatedRouteSnapshot ) {
    return this.cacheService.get(
        'allTypeFichiers',
        new FichierTypeFactory().list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
          shareReplay(1),
          map(data => data.data)
        ),
        1800000
      ).pipe(
      map((data: IFichierType[])=> {
        let filtered= data.filter(element=>element?.id==+route.paramMap.get('id'));
        return filtered.length ? filtered[0] : null;
      }
    ));
  }
}