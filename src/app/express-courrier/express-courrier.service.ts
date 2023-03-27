import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { CrReaffectationFactory } from '../core/services/gestion-courrier/cr-reaffectation';
import { UserFactory } from '../core/services/user.factory';
import { Filter, QueryOptions, Sort } from '../shared/models/query-options';
@Injectable({ providedIn: 'root' })
export class ExpressCourrierService {


  link: {libelle: string, icon: string, url: string}[] = [
    {
      libelle: 'Courrier',
      icon: 'fal fa-mail-bulk',
      url: './courrier/entrant'
    },
    {
      libelle: 'Documents',
      icon: 'fal fa-file-alt',
      url: './document'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-balance-scale',
      url: 'marche-public/marche'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-tachometer-alt-average',
      url: './dashboard'
    },
  ];

  linkCourrier: {libelle: string, icon: string, url: string}[] = [
    {
      libelle: 'Entrants',
      icon: 'fal fa-envelope',
      url: './courrier/entrant'
    },
    {
      libelle: 'Sortants',
      icon: 'fal fa-envelope-open',
      url: './courrier/sortant'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-balance-scale',
      url: './courrier/sortant'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-tachometer-alt-average',
      url: './dashboard'
    },
  ];

  TASK_REFRESH_INTERVAL_MS = 30000;
  private readonly autoRefresh$ = interval(this.TASK_REFRESH_INTERVAL_MS).pipe(
    startWith(0)
  );
  private readonly refreshToken$ = new BehaviorSubject(undefined);
  reaffectation$;
  onlineUsers$;

  constructor() {
    const crReaffectationService = new CrReaffectationFactory();
    this.reaffectation$ = this.autoRefresh$.pipe(
      switchMap(() => (crReaffectationService.list(
        new QueryOptions(
          [
            {or: false, filters:[new Filter('IsForIns', 1, 'eq')]},
          ],
        ).setSort([new Sort('created_at','DESC')])
      ).pipe(map(data=>data.data)))),
      distinctUntilChanged()
    );

    const userFact = new UserFactory();
    this.onlineUsers$ = combineLatest(this.autoRefresh$, this.refreshToken$).pipe(
      switchMap(() =>  userFact.onlineUsers()),
      distinctUntilChanged()
    );

    this.refreshToken$.next(undefined);
   }

}
