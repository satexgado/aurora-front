import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { CrCourrierSortantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-sortant';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { CourrierUiService } from './courrier-ui.service';

@Component({
  selector: 'app-courrier-ui',
  templateUrl: 'courrier-ui.component.html',
  styles: [`
    .card-1-hoverable:hover {
      transition: all 3s cubic-bezier(.25, .8, .25, 1);
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }

    .nav-link3.active {
      background-color: antiquewhite;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
  `]
})

export class CourrierUiComponent implements OnInit {
  TASK_REFRESH_INTERVAL_MS = 30000;
  private readonly autoRefresh$ = interval(this.TASK_REFRESH_INTERVAL_MS).pipe(
    startWith(0)
  );

  lastEntrant$;
  lastSortant$;
  lastInterne$;
  constructor(
    public service: CourrierUiService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() { 
    const courrierEntrantService = new CrCourrierEntrantFactory();
    this.lastEntrant$ = this.autoRefresh$.pipe(
      switchMap(() => courrierEntrantService.list(
        new QueryOptions(
          [
              {or: false, filters:[new Filter('externe', true, 'eq')]},
            {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
          ],
          [],
          3,
          1,
          [new Sort('created_at','DESC')]
      )).pipe(map(data=>data.data)))
    );

    this.lastInterne$ = this.autoRefresh$.pipe(
        switchMap(() => courrierEntrantService.list(
          new QueryOptions(
            [
                {or: false, filters:[new Filter('externe', 0, 'eq')]},
                {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
            ],
            [],
            3,
            1,
            [new Sort('created_at','DESC')]
        )).pipe(map(data=>data.data)))
    );

    const courrierSortantService = new CrCourrierSortantFactory();
    this.lastSortant$ = this.autoRefresh$.pipe(
      switchMap(() => courrierSortantService.list(
        new QueryOptions(
          [
            {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
          ],
          [],
          3,
          1,
          [new Sort('created_at','DESC')])
      ).pipe(map(data=>data.data)))
    );
  }

  onSelectCourrierEntrant(courrier: ICrCourrierEntrant = null) {
    this.service.courrierEntrantData = courrier;
    this.router.navigate(['./entrant', courrier.id], {relativeTo: this.route});
  }

  onSelectCourrierSortant(courrier: ICrCourrierSortant = null) {
    this.service.courrierSortantData = courrier;
    this.router.navigate(['./sortant', courrier.id], {relativeTo: this.route});
  }

}
