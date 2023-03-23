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
import { startWith } from 'rxjs/operators';
// import { UserActionComponent } from './user-action.component';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { User } from 'src/app/shared/state/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
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

.image_outer_container{
    margin-top: auto;
    margin-bottom: auto;
    border-radius: 50%;
    position: relative;
}

.image_inner_container{
    border-radius: 50%;
    padding: 5px;
    background-color: #f2cf07;
    background-image: linear-gradient(315deg, #f2cf07 0%, #55d284 74%);
}


.offline .image_inner_container {
  background-color: #f9fcff;
  background-image: linear-gradient(147deg, #f9fcff 0%, #dee4ea 74%);
}

.away .image_inner_container {
  background-color: #ff4e00;
  background-image: linear-gradient(315deg, #ff4e00 0%, #ec9f05 74%);
}

.image_inner_container img{
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 5px solid white;
}

.image_outer_container .icon_statut{
  background-color: #4cd137;
  position: absolute;
  right: 0px;
  bottom: 5px;
  height: 30px;
  width: 30px;
  border:5px solid white;
  border-radius: 50%;
}

  .online .icon_statut {
    background-color: #28a745!important;
  }

  .offline .icon_statut {
    background-color: #dc3545!important;
  }

  .away .icon_statut {
    background-color: #ffc107!important;
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
export class UserComponent extends EditableListComponent implements OnInit {

  TASK_REFRESH_INTERVAL_MS = 30000;
  private readonly autoRefresh$ = interval(this.TASK_REFRESH_INTERVAL_MS).pipe(
    startWith(0)
  );

  editModal = EditComponent;
  modalData: IUser;
  fragment: string = '';
  parentData: {relationName: string,relationId: number} = null;
  view: 'card' | 'list' =  localStorage.getItem("userViewType") ? <'card' | 'list'>localStorage.getItem("userViewType"):  'card';
  onGroupeUser;
  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('userViewType',view);
  }

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected notificationService: NotificationService,
    public route: ActivatedRoute,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new UserFactory()));
    this.titleservice.setTitle('mes Users')
    this.modalService = modalService;

    // let service = new UserActionComponent(notificationService, modalService);
    // this.onGroupeUser= (user: IUser) =>  service.onGroupeUser(user).subscribe(
    //   (statuts)=> {
    //   }
    // );
  }

  ngOnInit() {
    
    super.ngOnInit();
    this.dataHelper.sortColumn = 'nom_complet';
    // this.dataHelper.sortDirection = 'Asc';
    this.dataHelper.relations = [
      'affectation_structures.structure', 'affectation_structures.fonctions', 'affectation_structures.poste', 'affectation_structures.role'
    ];
    this.route.fragment.subscribe(
      (fragment)=> {

        this.fragment = fragment ?? '';
        this.dataHelper.clearData(true);

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
    item = new User();
    // item.tag = this.fragment;
    super.onShowCreateForm(item).subscribe(
       (data:IUser)=>{
         if(!this.parentData)  {return;}
         const service = new UserFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: IUser) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
}
}
