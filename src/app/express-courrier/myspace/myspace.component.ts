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
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';

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

  editModal = EditComponent;
  modalData: ICrCoordonnee;
  parentData: {relationName: string,relationId: number} = null;
  view: 'card' | 'list' =  localStorage.getItem("coordonneeViewType") ? <'card' | 'list'>localStorage.getItem("coordonneeViewType"):  'card';

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('coordonneeViewType',view);
  }

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrCoordonneeFactory()));
    this.titleservice.setTitle('mes Coordonnees')
    this.modalService = modalService;
  }

  ngOnInit() {
    this.cacheService.get('affectation-parent').subscribe(
      (data: {relationName: string,relationId: number})=>{
        const queryOptions = new QueryOptions(
          [
              {or: false, filters: [new Filter(`${data.relationName}_by_id`, data.relationId, 'eq')]}
          ],
          [],
          8,
          1,
          [new Sort('libelle','Asc')]
        );
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new CrCoordonneeFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
        this.dataHelper.sortColumn = 'libelle';
        this.dataHelper.sortDirection = 'Asc';
      }
    )
  }

  onShowCreateForm(item?, modal = this.editModal) {
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
