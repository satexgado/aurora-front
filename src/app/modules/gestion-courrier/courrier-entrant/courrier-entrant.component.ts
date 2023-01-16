import { CrCourrierEntrantFactory } from './../../../core/services/gestion-courrier/cr-courrier-entrant';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { Helper } from 'src/app/helpers/helper/helper';
import { UserFactory } from 'src/app/core/services/user.factory';
import { shareReplay, map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-courrier-entrant',
  templateUrl: './courrier-entrant.component.html'
})
export class CourrierEntrantComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  parentData: {relationName: string,relationId: number} = null;

  filters = {
    type_id: [],
    structure_id: [],
    suivi_par_id: [],
    nature_id: [],
    urgence_id: [],
    expediteur_externe_id: [],
    expediteur_interne_id: [],
  };

  is_advance_filter = false;
  multiParameter2 = {
    singleSelection: false,
    selectAllText: 'Tout selectionner',
    unSelectAllText: 'Tout deselectionner',
    itemsShowLimit: 5,
    labelKey: 'libelle',
    enableSearchFilter: true,
    tagToBody: false
  };

  cancelFilter() {
    this.filters = {
      type_id: [],
      structure_id: [],
      suivi_par_id: [],
      nature_id: [],
      urgence_id: [],
      expediteur_externe_id: [],
      expediteur_interne_id: [],
    };
    this.doFilter();
  }

  doFilter() {
    this.is_advance_filter = false;
    let filters = {or: false, filters:[]};

    Object.entries(this.filters).forEach(
      ([key, value]) => {
        if(value && value.length) {
          this.is_advance_filter = true;
          filters.filters.push(
            new Filter(key,
              value.map(el=>el.id).toString(),
            'eq')
          )
        }
      }
    );

    this.dataHelper.searchCustomFilterGroup = filters.filters.length ? filters : null;
    this.dataHelper.loadData(1);
  }

  dependancies = {
    types: [],
    structures: [],
    users: [],
    natures: [],
    urgences: [],
    coordonnees: [],
  };

  dependanciesLoading = {
    types: false,
    structures: false,
    users: false,
    natures: false,
    urgences: false,
    coordonnees: false,
  };

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    public structureService: StructureService,
    public helper2: Helper,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrCourrierEntrantFactory()));
    this.titleservice.setTitle('mes CourrierEntrants')
    this.modalService = modalService;
  }

  ngOnInit() {
    this.cacheService.get('affectation-parent').subscribe(
      (data: {relationName: string,relationId: number})=>{
        const queryOptions = new QueryOptions(
          [
              {or: false, filters:[new Filter('isIns', true, 'eq')]},
              {or: false, filters: [new Filter(`${data.relationName}_by_id`, data.relationId, 'eq')]}
          ],
          [
            'cr_courrier.cr_statut',
            'cr_courrier.cr_type',
          'cr_courrier.cr_nature',
          'cr_courrier.cr_urgence',
          'cr_courrier.cr_cloture',
          'cr_provenance'
          ],
          8,
          1,
          [new Sort('updated_at','DESC')]
        );
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new CrCourrierEntrantFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        this.dataHelper.relations = [
          'cr_courrier.cr_statut',
            'cr_courrier.cr_type',
          'cr_courrier.cr_nature',
          'cr_courrier.cr_urgence',
          'cr_courrier.cr_cloture',
          'cr_provenance'
        ];
        super.ngOnInit();
      }
    )
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:ICrCourrierEntrant)=>{
         if(!this.parentData)  {return;}
         const service = new CrCourrierEntrantFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 public getStructures(): void {
  if(this.dependancies.structures && this.dependancies.structures.length) {
    return;
  }
  this.dependanciesLoading.structures = true;
  this.structureService.all(false).subscribe((structures: any) => {
    this.dependancies.structures = structures;
    this.dependanciesLoading.structures = false;
  });
}

public getTypes(): void {
  if(this.dependancies.types && this.dependancies.types.length) {
    return;
  }
  this.dependanciesLoading.types = true;
  const service = new CrTypeFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((types: any) => {
    this.dependancies.types = types;
    this.dependanciesLoading.types = false;
  });
}

public getNatures(): void {
  if(this.dependancies.natures && this.dependancies.natures.length) {
    return;
  }
  this.dependanciesLoading.natures = true;
  const service = new CrNatureFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((natures: any) => {
    this.dependancies.natures = natures;
    this.dependanciesLoading.natures = false;
  });
}

public getUsers(): void {
  if(this.dependancies.users && this.dependancies.users.length) {
    return;
  }
  this.dependanciesLoading.users = true;
  const service = new UserFactory();
  service.list(new QueryOptions().setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])
).pipe(
  shareReplay(1),
  map(data => data.data)
).subscribe((users: any) => {
    this.dependancies.users = users;
    this.dependanciesLoading.users = false;
  });
}

public getUrgences(): void {
  if(this.dependancies.urgences && this.dependancies.urgences.length) {
    return;
  }
  this.dependanciesLoading.urgences = true;
  const service = new CrUrgenceFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((urgences: any) => {
    this.dependancies.urgences = urgences;
    this.dependanciesLoading.urgences = false;
  });
}

public getCoordonnees(): void {
  if(this.dependancies.coordonnees && this.dependancies.coordonnees.length) {
    return;
  }
  this.dependanciesLoading.coordonnees = true;
  const service = new CrCoordonneeFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((coordonnees: any) => {
    this.dependancies.coordonnees = coordonnees;
    this.dependanciesLoading.coordonnees = false;
  });
}

 open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-right modal-right-100vh', }).result.then((result) => {

  }, (reason) => {

  });
}

isEcheanceExpired(date: Date) {
  // your date logic here, recommend moment.js;
  return moment(date).isBefore(moment(new Date()));
  // or without using moment.js:
  // return product.experationDate.getTime() < currentdate.getTime();
  // or using Date
  // return new Date(product.experationDate).valueOf() < new Date(currentdate).valueOf();
}

  getDateStyle(date: Date) {
   let diff = moment(moment(date)).diff(moment(new Date()), 'days');
    if(diff < 7 && diff >=1 ) {
      return 'text-warning'
    }

    if(diff <= 0) {
      return 'text-danger';
    }

    return "tx-success-100"
  }
}
