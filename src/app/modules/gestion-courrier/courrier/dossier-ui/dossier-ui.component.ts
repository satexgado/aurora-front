import { CrDossierFactory } from 'src/app/core/services/gestion-courrier/cr-dossier';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from '../../dossier/edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of, Subscription } from 'rxjs';
import { ICrDossier } from 'src/app/core/models/gestion-courrier/cr-dossier';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { CourrierUiService } from '../courrier-ui.service';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { CrCourrierSortantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-sortant';

@Component({
  selector: 'app-courrier-dossier-ui',
  templateUrl: 'dossier-ui.component.html',
  styleUrls: ['./dossier-ui.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class CourrierDossierUiComponent extends EditableListComponent implements OnInit, OnDestroy {

  editModal = EditComponent;
  parentData: {relationName: string,relationId: number} = null;
  modalData: ICrDossier;
  fragment: string;
  allUserStructures: any[] = [];
  selectedStructure: IBase = null;
  entrantHelper: ResourceScrollableHelper;
  sortantHelper: ResourceScrollableHelper;
  interneHelper: ResourceScrollableHelper;
  subscription: Subscription = new Subscription();

  onSelectDossier(dossier: ICrDossier) {
    if(!dossier) {
      this.modalData = null;
      this.entrantHelper = null;
      this.sortantHelper = null;
      this.interneHelper = null;
      return;
    }

    const entrantQueryOptions = new QueryOptions(
      [
        {or: false, filters:[
          new Filter('externe', 1, 'eq'),
          new Filter('dossier_id', dossier.id, 'eq'),
        ]},
      ]
    );
    this.entrantHelper = new ResourceScrollableHelper(new CrCourrierEntrantFactory(), entrantQueryOptions);
    this.entrantHelper.withoutPaginate = true;
    this.entrantHelper.loadData(1);

    const sortantQueryOptions = new QueryOptions(
      [
        {or: false, filters:[new Filter('dossier_id', dossier.id, 'eq')]},
      ]
    );
    this.sortantHelper = new ResourceScrollableHelper(new CrCourrierSortantFactory(), sortantQueryOptions);
    this.sortantHelper.withoutPaginate = true;
    this.sortantHelper.loadData(1);

    const interneQueryOptions = new QueryOptions(
      [
        {or: false, filters:[
          new Filter('externe', 0, 'eq'),
          new Filter('dossier_id', dossier.id, 'eq'),
        ]},
      ]
    );
    this.interneHelper = new ResourceScrollableHelper(new CrCourrierEntrantFactory(), interneQueryOptions);
    this.interneHelper.withoutPaginate = true;
    this.interneHelper.loadData(1);

    this.modalData = dossier;
  }

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    public serviceCourrierUi: CourrierUiService,
    protected structureService: StructureService,
    public authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrDossierFactory()));
    this.titleservice.setTitle('mes Dossiers')
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
          ['structure'],
          8,
          1,
          [new Sort('libelle','Asc')]
        );
        this.parentData = data;
        this.dataHelper.withoutPaginate = true;
        this.dataHelper = new ResourceScrollableHelper(new CrDossierFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
        this.dataHelper.sortColumn = 'libelle';
        this.dataHelper.sortDirection = 'Asc';
        this.dataHelper.withoutPaginate = true;
        this.dataHelper.relations = ['structure'];
      }
    )
    const detailsView = 'entrant,sortant';
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if(!detailsView.includes(fragment)) {
        this.fragment = 'entrant';
      }
    });

    this.structureService.getByUser(this.authService.user.id).subscribe(
      (data)=> {
        this.allUserStructures = data ? data.data : [];
      }
    );

    this.subscription.add(
      this.router.events.subscribe((event: Event) => {
        switch (true) {
          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.onLoadChild();
            break;
          }
          default: {
            break;
          }
        }
      })
      )
    this.onLoadChild();
  }

  onLoadChild() {
    if(this.route.firstChild) {
       return this.route.firstChild.data.subscribe(
        (data: { dossier: ICrDossier }) =>
        {
          if((!data.dossier))
          {
            this.router.navigate(['/courrier/dossier']);
          }
          this.titleservice.setTitle(data.dossier.libelle);
          this.onSelectDossier(data.dossier);
        }
      );
    }
    this.onSelectDossier(null);
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:ICrDossier)=>{
         if(!this.parentData)  {return;}
         const service = new CrDossierFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: ICrDossier) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
}

onSetSelect(data) {
  this.modalData = data;
}

onSelectCourrierEntrant(courrier: ICrCourrierEntrant = null) {
  this.serviceCourrierUi.courrierEntrantData = courrier;
  this.router.navigate(['/courrier/entrant', courrier.id]);
}

onSelectCourrierSortant(courrier: ICrCourrierSortant = null) {
  this.serviceCourrierUi.courrierSortantData = courrier;
  this.router.navigate(['/courrier/sortant', courrier.id]);
}

onSelectCourrierInterne(courrier: ICrCourrierEntrant = null) {
  this.serviceCourrierUi.courrierEntrantData = courrier;
  this.router.navigate(['/courrier/interne', courrier.id]);
}


onSetSelected(structure: IBase) {
  if(this.selectedStructure && this.selectedStructure.id == structure.id) {
    this.selectedStructure = null;
    return;
  }
  this.selectedStructure = structure;
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}
}
