import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { ChartFormData } from '../chart-interface';
import { MpMarcheTypeFactory } from 'src/app/core/services/marche-public/type-marche.model';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { MpProcedureTypeFactory } from 'src/app/core/services/marche-public/type-procedure.model';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Factory as AuthAccess} from 'src/app/helpers/factory/factory'
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';

export interface ListResult {
  current_page: number; data: any; from: number; last_page: number; per_page: number; total: number;
}

export interface QueryParameter {
  libelle: string; query: QueryOptions, couleur: string, type: string
}

export interface Result {
  libelle: string; couleur: string; type: string; data: {libelle: string, data: number}[]
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

  private _cacheDepartements$: Observable<any>;
  protected _loading$ = new BehaviorSubject<boolean>(true);

  private _cacheUsers$: Observable<any>;
  private _cacheTypes$: Observable<any>;
  private _cacheProcedures$: Observable<any>;
  private _cacheServices$: Observable<any>;
  private _cacheCoordonnees$: Observable<any>;
  chartFormData: ChartFormData;

  get loading$() { return this._loading$.asObservable(); }


  constructor( protected authAccess: AuthAccess ) {  }

  list(queryOptions: QueryParameter[]): Observable<Result[]> {
    return this.authAccess
      .post(`marche-public/marches/analyses-datas`,queryOptions)
      .pipe(map((data: Result[]) => {
        return data;
      }));
  }

  get allUsers$()  {
    if (!this._cacheUsers$) {
        this._cacheUsers$ = new UserFactory().list(new QueryOptions().setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])).pipe(
          shareReplay(1),
          map(data => data.data)
        );
    }
    return this._cacheUsers$;
}

  get allTypes$()  {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle','asc')];
    if (!this._cacheTypes$) {
      this._loading$.next(true);
        this._cacheTypes$ = new MpMarcheTypeFactory().list(queryOptions).pipe(
          shareReplay(1),
          map(data => data.data)
        );
    }
    return this._cacheTypes$;
}


get allServices$()  {
  const queryOptions = new QueryOptions();
  if (!this._cacheServices$) {
    this._loading$.next(true);
      this._cacheServices$ = new StructureService().all(false).pipe(
        shareReplay(1),
      );
  }
  return this._cacheServices$;
}


  get allProcedures$()  {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle','asc')];
    if (!this._cacheProcedures$) {
      this._loading$.next(true);

        this._cacheProcedures$ = new MpProcedureTypeFactory().list(queryOptions).pipe(
          shareReplay(1),
          map(data => data.data)
        );
    }
    return this._cacheProcedures$;
}

  get allCoordonnees$()  {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle','asc')];
    if (!this._cacheCoordonnees$) {
      this._loading$.next(true);

        this._cacheCoordonnees$ = new CrCoordonneeFactory().list(queryOptions).pipe(
          shareReplay(1),
          map(data => data.data)
        );
    }
    return this._cacheCoordonnees$;
  }

}
