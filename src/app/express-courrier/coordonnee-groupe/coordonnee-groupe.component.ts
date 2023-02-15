import { ICrCoordonnee } from './../../core/models/gestion-courrier/cr-coordonnee';
import { CrCoordonneeGroupeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee-groupe';
import { Component, OnDestroy, OnInit} from '@angular/core';
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
import { of, Subscription } from 'rxjs';
import { ICrCoordonneeGroupe } from 'src/app/core/models/gestion-courrier/cr-coordonnee-groupe';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { AffectationCoordonneeGroupeEditComponent } from './affectation/affectation.component';
import { CoordonneeActionComponent } from '../coordonnee/coordonnee-action.component';
import { CoordonneeGroupeActionComponent } from './coordonnee-action.component';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';

@Component({
  selector: 'app-coordonnee-groupe',
  templateUrl: './coordonnee-groupe.component.html',
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
export class CoordonneeGroupeComponent extends EditableListComponent implements OnInit, OnDestroy {

  editModal = EditComponent;
  modalData: ICrCoordonneeGroupe;
  parentData: {relationName: string,relationId: number} = null;
  view: 'card' | 'list' =  localStorage.getItem("coordonnee-groupeViewType") ? <'card' | 'list'>localStorage.getItem("coordonnee-groupeViewType"):  'card';
  selectedGroupe: ICrCoordonneeGroupe = null;
  coordonneeHelper: ResourceScrollableHelper;
  onGroupeCoordonnee;
  subscription: Subscription = new Subscription();

  onSetSelected(groupe: ICrCoordonneeGroupe) {
    if(!groupe) {
      this.selectedGroupe = null;
      this.coordonneeHelper = null;
      return;
    }
    const queryOptions = new QueryOptions(
      [
          {or: false, filters: [new Filter('groupes_id', groupe.id+'' , 'eq')]}
      ],
      [],
      8,
      1,
      [new Sort('libelle','Asc')]
    );
    this.coordonneeHelper = new ResourceScrollableHelper(new CrCoordonneeFactory(), queryOptions);
    this.coordonneeHelper.withoutPaginate = true;
    this.coordonneeHelper.loadData(1);
    this.selectedGroupe = groupe;
  }

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('coordonnee-groupeViewType',view);
  }

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected notificationService: NotificationService,
    private router: Router,
    public route: ActivatedRoute,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrCoordonneeGroupeFactory()));
    this.titleservice.setTitle('mes Coordonnees')
    this.modalService = modalService;
    let service = new CoordonneeGroupeActionComponent(notificationService, modalService);
    this.onGroupeCoordonnee= (coordonnee: ICrCoordonneeGroupe) =>  service.onGroupeCoordonnee(coordonnee).subscribe(
      (statuts)=> {
        if(this.selectedGroupe && this.coordonneeHelper && coordonnee.id ==  this.selectedGroupe.id) {
          this.coordonneeHelper.loadData(1);
        }
      }
    );
  }

  ngOnInit() {
    this.subscription.add(
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
          this.dataHelper.withoutPaginate = true;
          this.dataHelper = new ResourceScrollableHelper(new CrCoordonneeGroupeFactory(), queryOptions);
          super.ngOnInit()
        },
        ()=>{
          super.ngOnInit();
          this.dataHelper.sortColumn = 'libelle';
          this.dataHelper.sortDirection = 'Asc';
          this.dataHelper.withoutPaginate = true;
        }
      )
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
        (data: { coordonneeGrp: ICrCoordonneeGroupe }) =>
        {
          if((!data.coordonneeGrp))
          {
            this.router.navigate(['/groupe-contact']);
          }
          this.titleservice.setTitle(data.coordonneeGrp.libelle);
          this.onSetSelected(data.coordonneeGrp);
        }
      );
    }
    // this.onSetSelected(null);
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:ICrCoordonneeGroupe)=>{
         if(!this.parentData)  {return;}
         const service = new CrCoordonneeGroupeFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 onShowAffectationCoordonneeGroupeForm(item: ICrCoordonneeGroupe) {
  const modalRef = this.modalService.open(AffectationCoordonneeGroupeEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
  modalRef.componentInstance.title = `Collaborateur`;
  modalRef.componentInstance.item = item;
  modalRef.componentInstance.isUpdating = true;
  modalRef.componentInstance.newItem.subscribe(
    (data: ICrCoordonneeGroupe) => {
      // let taches = this._taches$.value ? this._taches$.value : [] ;
      // taches = taches.map(element => {
      //     if (element.id === item.id ) {
      //         Object.assign(element,data);
      //     }
      //     return element;
      // });
      // this._taches$.next(taches);
      // this.changeIndicator++;
    }
  );
}

  openModal(content, data: ICrCoordonneeGroupe) {
    this.modalData = data;
    this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
  }

  onRemoveCoordonnee(coordonnee: ICrCoordonnee, groupe: ICrCoordonneeGroupe = this.selectedGroupe) {
    const service = new CrCoordonneeFactory();
    const duplicate = JSON.parse(JSON.stringify(coordonnee));

    const cancelDelete = (index: number = 0) => {
      service.attachAffectation(coordonnee.id, 'cr_coordonnee_groupes', groupe.id).subscribe(
          (data) => {
            if(this.selectedGroupe && this.coordonneeHelper && groupe.id ==  this.selectedGroupe.id) {
              this.coordonneeHelper.addItemTo(duplicate, index);
            }
            this.notificationService.onInfo("La suppression a été annuler");
          }, () => {
          }
        );
    };

    this.notificationService.title = 'Suppréssion';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + coordonnee.libelle;


    const confirm = () => {
        service.detachAffectation(coordonnee.id, 'cr_coordonnee_groupes', groupe.id).subscribe(
          () => {
            let index = this.coordonneeHelper.removeItem(coordonnee.id) ?? 0;
            this.notificationService.onCancel(()=>{cancelDelete(index)}, "L'élément '"+coordonnee.libelle+"' a été supprimé" ,'Suppression' , 'success', 'Annuler la suppresion');
          }, () => {
            this.notificationService.onInfo('l\'élément est utilisé');
          }
        );
    };

    const cancel = () => {
    };

    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm, cancel);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
