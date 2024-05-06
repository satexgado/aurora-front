import { AffectationTacheEditComponent } from 'src/app/modules/gestion-courrier/tache/affectation/affectation.component';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { Component, OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { ICrTache, CrTacheStatut, CrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { EditComponent } from 'src/app/modules/gestion-courrier/tache/edit/edit.component';
import { ItemSelectHelper } from 'src/app/shared/state';
import { AffectationTacheCourrierEditComponent } from '../gestion-courrier/tache/affectation-courrier/affectation-courrier.component';
import { filterGrp } from '../../shared/models/query-options/query-options.model';
import * as moment from 'moment';

@Component({
  selector: 'app-gestionnaire-tache',
  templateUrl: './tache.component.html',
  styleUrls: ['./tache.component.css']
})
export class GestionnaireTacheComponent implements OnDestroy {

    subscription: Subscription = new Subscription();

    view: 'kanban' | 'list' =  localStorage.getItem("tacheViewType") ? <'kanban' | 'list'>localStorage.getItem("tacheViewType"):  'kanban';
    filterStatutHelper = new ItemSelectHelper();
    onChangeView(view : 'kanban' | 'list') {
      this.view = view;
      localStorage.setItem('tacheViewType',view);
    }
    searchTerm: string;
    changeIndicator = 0;
    CrTacheStatut = CrTacheStatut;
    @Input() selectedTache: ICrTache;
    @Input() courrier_id = null;
    @Input() parentData: {relationName: string, relationId: number|any[]} = null;

    commentData: {filters: filterGrp[], parent: {type: string, id: number}};
    removeAfterArchive=false;

    @Input() set init(filters: filterGrp[]) {
      const service = new CrTacheFactory();
      this.subscription.add(service.list(
        new QueryOptions(
          filters,
          ['responsables', 'structures', 'inscription', 'courriers'],
          undefined,
          undefined,
          [new Sort('created_at','ASC')]
        )
      ).subscribe(
          (data)=> {
            this.is_loading_schema = false;
            this._taches$.next(data.data ?? []);
            this.changeIndicator++;
      }));
    }

    @Input() set initTacheList(taches: ICrTache[]) {
      this.is_loading_schema = false;
      this._taches$.next(taches ?? []);
      this.changeIndicator++;
    }

    is_loading_schema = true;
    _taches$: BehaviorSubject<ICrTache[]> = new BehaviorSubject([]);

    get taches$() {
      return this._taches$.asObservable();
    }

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        public router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
    ) { }

    ngOnInit() {

      this.filterStatutHelper.addSelectedItem(
        [CrTacheStatut.traitement, CrTacheStatut.attente, CrTacheStatut.valide, CrTacheStatut.nonvalide]
      )

      this.route.data.subscribe((data) => {
        if(data.filters) {
          this.init = data.filters;
        }

        if(data.removeAfterArchive) {
          this.removeAfterArchive = data.removeAfterArchive;
        }
      });
      
    }

    onShowCreateTacheForm() {
      const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      const instance = modalRef.componentInstance as EditComponent;
      instance.title = `Creer:`;
      if(this.courrier_id) {
        instance.courrier_id = this.courrier_id;
      } else if(this.parentData) {
        instance.relation =  {
          name:this.parentData.relationName, id: this.parentData.relationId
        };
      }
      instance.newItem.subscribe(
        (data) => {
          data.statut = 'En attente';
          const taches = this._taches$.value ? this._taches$.value : [] ;
          taches.unshift(data);
          this._taches$.next(taches);
          this.changeIndicator++;
        }
      );
    }

    onShowComment(item: ICrTache = null) {

      if(!item) return this.selectedTache = null;
      this.selectedTache = item;
      this.selectedTache.comments_count = 0;
      this.commentData = {
        filters: [
          {or: false, filters: [
            new Filter('parent_tache_id', item.id, 'eq')
          ]}
        ],
        parent: {type:'cr_taches', id: item.id}
      };
    }

    onShowUpdateTacheForm(item: ICrTache) {
      const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Modifier: ${item.libelle}`;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data: ICrTache) => {
          let taches = this._taches$.value ? this._taches$.value : [] ;
          taches = taches.map(element => {
              if (element.id === item.id ) {
                  Object.assign(element,data);
              }
              return element;
          });
          this._taches$.next(taches);
          this.changeIndicator++;
        }
      );
    }

    onSoftUpdate(item: ICrTache) {
      let taches = this._taches$.value ? this._taches$.value : [] ;
          taches = taches.map(element => {
              if (element.id === item.id ) {
                  Object.assign(element,item);
              }
              return element;
          });
        this._taches$.next(taches);
        this.changeIndicator++;

      const service = new CrTacheFactory();
        service.update(item).subscribe(
          (data)=> {
          }
        )
    }

    onShowAffectationTacheForm(item: ICrTache) {
      const modalRef = this.modalService.open(AffectationTacheEditComponent, { size: 'lg',   backdrop: 'static' });
      modalRef.componentInstance.title = `Collaborateur`;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data: ICrTache) => {
          let taches = this._taches$.value ? this._taches$.value : [] ;
          taches = taches.map(element => {
              if (element.id === item.id ) {
                  Object.assign(element,data);
              }
              return element;
          });
          this._taches$.next(taches);
          this.changeIndicator++;

        }
      );
    }

    onShowAffectationCourrierForm(item: ICrTache) {
      const modalRef = this.modalService.open(AffectationTacheCourrierEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Courrier`;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data: ICrTache) => {
          let taches = this._taches$.value ? this._taches$.value : [] ;
          taches = taches.map(element => {
              if (element.id === item.id ) {
                  Object.assign(element,data);
              }
              return element;
          });
          this._taches$.next(taches);
          this.changeIndicator++;
        }
      );
    }

    onDeleteTache(item: ICrTache) {

      const libelle =  item.libelle;
      const taches = this._taches$.value ? this._taches$.value : [] ;
      const index = taches.findIndex(element => element.id === item.id);
      const cancelDelete = () => {
        const service = new CrTacheFactory();
        service.restore(item.id).subscribe(
            (data) => {
              taches.splice(index, 0, data);
              this._taches$.next(taches);
              this.changeIndicator++;
              this.notificationService.onInfo("La suppression a été annuler");
            }, () => {
            }
          );
      };


      this.notificationService.title = 'Suppréssion';
      this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + item.libelle;

      const confirm = () => {
        const service = new CrTacheFactory();
        service.delete(item.id).subscribe(
            () => {
              this.notificationService.onCancel(cancelDelete, "L'élément '"+libelle+"' a été supprimé" ,'Suppression' , 'success', 'Annuler la suppresion');
            }, () => {
              this.notificationService.onInfo('l\'élément est utilisé');
            }
          );
          taches.splice(index,1);
          this._taches$.next(taches);
          this.changeIndicator++;
      };

      const cancel = () => {
      };

      this.notificationService.bodyMaxLength = 300;
      this.notificationService.backdrop =  0;
      this.notificationService.onConfirmation(confirm, cancel);
      this.notificationService.bodyMaxLength = 80;
      this.notificationService.backdrop =  -1;
    }

    onAddToArchive(item: ICrTache) {
      const libelle =  item.libelle;
      const taches = this._taches$.value ? this._taches$.value : [] ;
      const index = taches.findIndex(element => element.id === item.id);
      const cancelDelete = () => {
        const service = new CrTacheFactory();
        item.archived_at = '';
        service.update(item).subscribe(
            (data) => {
              if(this.removeAfterArchive) {
                item.archived_at = null;
                taches.splice(index, 0, item);
                this._taches$.next(taches);
                this.changeIndicator++;
              }
              this.notificationService.onInfo("L'archivage a été annuler");
            }, () => {
            }
          );
      };


      this.notificationService.title = 'Archivage';
      this.notificationService.body = 'Êtes-vous sûr(e) de vouloir archiver?' + ' ' + item.libelle;

      const confirm = () => {
        item.archived_at = new Date();

        const service = new CrTacheFactory();
        service.update(item).subscribe(
          () => {
            this.notificationService.onCancel(cancelDelete, "L'élément '"+libelle+"' a été archivé" ,'Archivage' , 'success', "Annuler l'archivage");
          }, () => {
            this.notificationService.onInfo('l\'élément est utilisé');
          }
        )
        if(this.removeAfterArchive) {
          taches.splice(index,1);
          this._taches$.next(taches);
          this.changeIndicator++;
        }
      };

      const cancel = () => {
      };

      this.notificationService.bodyMaxLength = 300;
      this.notificationService.backdrop =  0;
      this.notificationService.onConfirmation(confirm, cancel);

      this.notificationService.bodyMaxLength = 80;
      this.notificationService.backdrop =  -1;
    } 

    onRemoveFromArchive(item) {
      item.archived_at = '';
      const service = new CrTacheFactory();
      service.update(item).subscribe(
        () => {
          this.notificationService.onInfo("L'element a été deplacer dans vos tâches");

          if(this.removeAfterArchive) {
            const taches = this._taches$.value ? this._taches$.value : [] ;
            const index = taches.findIndex(element => element.id === item.id);
            taches.splice(index,1);
            this._taches$.next(taches);
            this.changeIndicator++;
          }
        }, () => {
          this.notificationService.onInfo('l\'élément est utilisé');
        }
      )
    }

    onArchivateTache(item: ICrTache) {
      if(item.archived_at) {
       return this.onRemoveFromArchive(item);
      }
      this.onAddToArchive(item);
    }


    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }

    isEcheanceExpired(date: Date) {
      // your date logic here, recommend moment.js;
      return moment(date).isBefore(moment(new Date()));
      // or without using moment.js:
      // return product.experationDate.getTime() < currentdate.getTime();
      // or using Date
      // return new Date(product.experationDate).valueOf() < new Date(currentdate).valueOf();
    }

}
