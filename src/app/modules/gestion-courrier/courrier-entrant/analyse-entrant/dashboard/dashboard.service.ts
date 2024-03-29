import { CrDossierFactory } from 'src/app/core/services/gestion-courrier/cr-dossier';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { CrStatutFactory } from 'src/app/core/services/gestion-courrier/cr-statut';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Injectable, Input } from '@angular/core';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { ChartFormData } from '../chart-interface';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Factory as AuthAccess } from 'src/app/helpers/factory/factory'
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { SavedStateFactory } from 'src/app/core/services/saved-state.factory';
import { ISavedState } from 'src/app/core/models/saved-state.model';

export interface ListResult {
  current_page: number; data: any; from: number; last_page: number; per_page: number; total: number;
}

export interface QueryParameter {
  libelle: string; query: QueryOptions, couleur: string, type: string
}

export interface Result {
  libelle: string; couleur: string; type: string; data: { libelle: string, data: number }[]
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _cacheDepartements$: Observable<any>;
  protected _loading$ = new BehaviorSubject<boolean>(true);

  private _cacheUsers$: Observable<any>;
  private _cacheTypes$: Observable<any>;
  private _cacheStatuts$: Observable<any>;
  private _cacheNatures$: Observable<any>;
  private _cacheUrgences$: Observable<any>;
  private _cacheServices$: Observable<any>;
  private _cacheCoordonnees$: Observable<any>;
  private _cacheDossiers$: Observable<any>;
  private _cacheSavedStateInternes$: Observable<any>;
  private _cacheSavedStateEntrants$: Observable<any>;

  chartFormData: ChartFormData;

  get loading$() { return this._loading$.asObservable(); }


  constructor(protected authAccess: AuthAccess) { }

  list(queryOptions: QueryParameter[]): Observable<Result[]> {
    return this.authAccess
      .post(`courrier/courrier-entrants/analyses-datas`, queryOptions)
      .pipe(map((data: Result[]) => {
        return data;
      }));
  }

  get allUsers$() {
    if (!this._cacheUsers$) {
      this._cacheUsers$ = new UserFactory().list(new QueryOptions().setSort([new Sort('prenom', 'ASC'), new Sort('nom', 'ASC')])).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheUsers$;
  }

  get allTypes$() {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle', 'asc')];
    if (!this._cacheTypes$) {
      this._loading$.next(true);
      this._cacheTypes$ = new CrTypeFactory().list(queryOptions).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheTypes$;
  }

  get allStatuts$() {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle', 'asc')];
    if (!this._cacheStatuts$) {
      this._loading$.next(true);
      this._cacheStatuts$ = new CrStatutFactory().list(queryOptions).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheStatuts$;
  }

  get allDossiers$() {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle', 'asc')];
    if (!this._cacheDossiers$) {
      this._loading$.next(true);
      this._cacheDossiers$ = new CrDossierFactory().list(queryOptions).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheDossiers$;
  }

  get allNatures$() {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle', 'asc')];
    if (!this._cacheNatures$) {
      this._loading$.next(true);
      this._cacheNatures$ = new CrNatureFactory().list(queryOptions).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheNatures$;
  }

  get allUrgences$() {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle', 'asc')];
    if (!this._cacheUrgences$) {
      this._loading$.next(true);
      this._cacheUrgences$ = new CrUrgenceFactory().list(queryOptions).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheUrgences$;
  }

  get allSavedStateInternes$() {
    const queryOptions = new QueryOptions([
      {
        or: false, filters: [
          new Filter('is_ins', false, 'ct'),
          new Filter('module', 'courrier interne', 'eq'),
        ]
      },
    ]);
    queryOptions.sort = [new Sort('updated_at', 'desc')];
    if (!this._cacheSavedStateInternes$) {
      this._loading$.next(true);
      this._cacheSavedStateInternes$ = new SavedStateFactory().list(queryOptions).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheSavedStateInternes$;
  }

  addSavedStateInterne(item: ISavedState) {
    this._cacheSavedStateInternes$.subscribe(
      (savedStates) => {
        let data = savedStates ? savedStates : [];
        data.unshift(item);
        this._cacheSavedStateInternes$ = of(data);
      }
    );
}

  addSavedStateInterneTo(item: ISavedState, index = 0) {
    this._cacheSavedStateInternes$.subscribe(
      (savedStates) => {
        let data = savedStates ? savedStates : [];
        data.splice( index, 0, item);
        this._cacheSavedStateInternes$ = of(data);
      }
    );
  }

  updateSavedStateInterne(item: ISavedState) {
    this._cacheSavedStateInternes$.subscribe(
      (savedStates) => {
        let data = savedStates ? savedStates : [];
        data = data.map(element => {
          if (element.id === item.id) {
            element = item;
          }
          return element;
        });
        this._cacheSavedStateInternes$ = of(data);
      }
    );
  }

  removeSavedStateInterne(id: number) {
    this._cacheSavedStateInternes$.subscribe(
      (savedStates) => {
        const data = savedStates ? savedStates : [];
        const index = data.findIndex(element => element.id === id);
        data.splice(index, 1);
        this._cacheSavedStateInternes$ = of(data);
      }
    );
    
  }

  get allSavedStateEntrants$() {
    const queryOptions = new QueryOptions([
      {
        or: false, filters: [
          new Filter('is_ins', false, 'ct'),
          new Filter('module', 'courrier entrant', 'eq'),
        ]
      },
    ]);
    queryOptions.sort = [new Sort('updated_at', 'desc')];
    if (!this._cacheSavedStateEntrants$) {
      this._loading$.next(true);
      this._cacheSavedStateEntrants$ = new SavedStateFactory().list(queryOptions).pipe(
        shareReplay(1),
        map(data => data.data)
      );
    }
    return this._cacheSavedStateEntrants$;
  }

  addSavedStateEntrant(item: ISavedState) {
    this._cacheSavedStateEntrants$.subscribe(
      (savedStates) => {
        let data = savedStates ? savedStates : [];
        data.unshift(item);
        this._cacheSavedStateEntrants$ = of(data);
      }
    );
}

  addSavedStateEntrantTo(item: ISavedState, index = 0) {
    this._cacheSavedStateEntrants$.subscribe(
      (savedStates) => {
        let data = savedStates ? savedStates : [];
        data.splice( index, 0, item);
        this._cacheSavedStateEntrants$ = of(data);
      }
    );
  }

  updateSavedStateEntrant(item: ISavedState) {
    this._cacheSavedStateEntrants$.subscribe(
      (savedStates) => {
        let data = savedStates ? savedStates : [];
        data = data.map(element => {
          if (element.id === item.id) {
            element = item;
          }
          return element;
        });
        this._cacheSavedStateEntrants$ = of(data);
      }
    );
  }

  removeSavedStateEntrant(id: number) {
    this._cacheSavedStateEntrants$.subscribe(
      (savedStates) => {
        const data = savedStates ? savedStates : [];
        const index = data.findIndex(element => element.id === id);
        data.splice(index, 1);
        this._cacheSavedStateEntrants$ = of(data);
      }
    );
    
  }

  get allServices$() {
    if (!this._cacheServices$) {
      this._loading$.next(true);
      this._cacheServices$ = new StructureService().all(false).pipe(
        shareReplay(1),
      );
    }
    return this._cacheServices$;
  }

  get allCoordonnees$() {
    const queryOptions = new QueryOptions();
    queryOptions.sort = [new Sort('libelle', 'asc')];
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
