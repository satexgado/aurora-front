import { CrDossierFactory } from './../../../core/services/gestion-courrier/cr-dossier';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { ICrDossier } from 'src/app/core/models/gestion-courrier/cr-dossier';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CourrierUiService } from '../courrier/courrier-ui.service';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';

@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.css'],
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
export class DossierComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  parentData: {relationName: string,relationId: number} = null;
  modalData: ICrDossier;
  fragment: string;


  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    public serviceCourrierUi: CourrierUiService,
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
          ['cr_courrier_entrants', 'cr_courrier_sortants'],
          8,
          1,
          [new Sort('libelle','Asc')]
        );
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new CrDossierFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
        this.dataHelper.sortColumn = 'libelle';
        this.dataHelper.sortDirection = 'Asc';
        this.dataHelper.relations = ['cr_courrier_entrants', 'cr_courrier_sortants'];
      }
    )
    const detailsView = 'entrant,sortant';
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if(!detailsView.includes(fragment)) {
        this.fragment = 'entrant';
      }
    })
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
}
