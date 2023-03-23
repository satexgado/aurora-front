import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { ICrReaffectation } from 'src/app/core/models/gestion-courrier/cr-reaffectation';
import { CrReaffectationFactory } from 'src/app/core/services/gestion-courrier/cr-reaffectation';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { CourrierUiService } from '../courrier-ui.service';

@Component({
  selector: 'app-reaffectation-ui',
  templateUrl: 'reaffectation-ui.component.html',
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

export class ReaffectationUiComponent implements OnInit {

  reaffectationHelper; 

  constructor(
    public service: CourrierUiService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.reaffectationHelper = new ResourceScrollableHelper(
        new CrReaffectationFactory(),
        new QueryOptions(
            [
              {or: false, filters:[new Filter('IsForIns', 1, 'eq')]},
            ],['cr_courrier']
        ).setSort([new Sort('created_at','DESC')])
    );
    this.reaffectationHelper.loadData(1);
  }

  onSelectCourrierEntrant(courrier: ICrCourrierEntrant = null) {
    this.service.courrierEntrantData = courrier;
    this.router.navigate(['./entrant', courrier.id], {relativeTo: this.route});
  }

  onSelectCourrierSortant(courrier: ICrCourrierSortant = null) {
    this.service.courrierSortantData = courrier;
    this.router.navigate(['./sortant', courrier.id], {relativeTo: this.route});
  }

  onValidateReaffectation( reaffectation: ICrReaffectation, confirmation = true ) {
    if(confirmation)  {
      reaffectation.confirmation = 1;
      reaffectation.annulation = 0;
    } else {
      reaffectation.confirmation = 0;
      reaffectation.annulation = 1;
    }

    const service = new CrReaffectationFactory();
    service.update(reaffectation).subscribe(
      (data)=> {
        reaffectation = data;
      }
    );
    

  }

  checkData() {
    if(this.reaffectationHelper && this.reaffectationHelper.hasMoreData) {
      this.reaffectationHelper.loadData();
    }
  }

}
