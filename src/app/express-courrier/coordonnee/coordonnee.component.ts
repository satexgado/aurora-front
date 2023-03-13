import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent, NotificationService } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { interval, of } from 'rxjs';
import { CrCoordonnee, ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { startWith } from 'rxjs/operators';
import { CoordonneeActionComponent } from './coordonnee-action.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coordonnee',
  templateUrl: './coordonnee.component.html',
  styles: [`
  .card {
    margin-bottom: 24px;
    box-shadow: 0 2px 3px #e4e8f0;
}
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid #eff0f2;
}
.avatar-md {
    height: 4rem;
    width: 4rem;
}
.rounded-circle {
    border-radius: 50%!important;
}
.img-thumbnail {
    padding: 0.25rem;
    background-color: #f1f3f7;
    border: 1px solid #eff0f2;
    border-radius: 0.75rem;
}
.avatar-title {
    align-items: center;
    background-color: #3b76e1;
    color: #fff;
    display: flex;
    font-weight: 500;
    height: 100%;
    justify-content: center;
    width: 100%;
}
.bg-soft-primary {
    background-color: rgba(59,118,225,.25)!important;
}
a {
    text-decoration: none!important;
}
.badge-soft-danger {
    color: #f56e6e !important;
    background-color: rgba(245,110,110,.1);
}
.badge-soft-success {
    color: #63ad6f !important;
    background-color: rgba(99,173,111,.1);
}
.mb-0 {
    margin-bottom: 0!important;
}
.badge {
    display: inline-block;
    padding: 0.25em 0.6em;
    font-size: 75%;
    font-weight: 500;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.75rem;
}
  `],
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
export class CoordonneeComponent extends EditableListComponent implements OnInit {

  TASK_REFRESH_INTERVAL_MS = 30000;
  private readonly autoRefresh$ = interval(this.TASK_REFRESH_INTERVAL_MS).pipe(
    startWith(0)
  );

  editModal = EditComponent;
  modalData: ICrCoordonnee;
  fragment: string = '';
  parentData: {relationName: string,relationId: number} = null;
  view: 'card' | 'list' =  localStorage.getItem("coordonneeViewType") ? <'card' | 'list'>localStorage.getItem("coordonneeViewType"):  'card';
  onGroupeCoordonnee;
  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('coordonneeViewType',view);
  }

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected notificationService: NotificationService,
    public route: ActivatedRoute,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrCoordonneeFactory()));
    this.titleservice.setTitle('mes Coordonnees')
    this.modalService = modalService;

    let service = new CoordonneeActionComponent(notificationService, modalService);
    this.onGroupeCoordonnee= (coordonnee: ICrCoordonnee) =>  service.onGroupeCoordonnee(coordonnee).subscribe(
      (statuts)=> {
      }
    );
  }

  ngOnInit() {
    
    super.ngOnInit();
    this.dataHelper.sortColumn = 'libelle';
    this.dataHelper.sortDirection = 'Asc';

    this.route.fragment.subscribe(
      (fragment)=> {

        this.fragment = fragment ?? '';

        switch (fragment) {
          case 'fournisseur':
            this.dataHelper.query = [
              {or: false, filters:[new Filter('has_tag', 'fournisseur', 'eq')]},
            ];
            break;
    
          case 'partenaire':
            this.dataHelper.query = [
              {or: false, filters:[new Filter('has_tag', 'partenaire', 'eq')]},
            ];
            break;
        
          default:
            this.dataHelper.query = [];
            break;
        }
        
        this.dataHelper.loadData(1);
      }
    )

  }

  onShowCreateForm(item?, modal = this.editModal) {
    item = new CrCoordonnee();
    item.tag = this.fragment;
    super.onShowCreateForm(item).subscribe(
       (data:ICrCoordonnee)=>{
         if(!this.parentData)  {return;}
         const service = new CrCoordonneeFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: ICrCoordonnee) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
}
}
