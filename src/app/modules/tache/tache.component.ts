import { AffectationTacheEditComponent } from 'src/app/modules/gestion-courrier/tache/affectation/affectation.component';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { Component, OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { ICrTache, CrTacheStatut } from 'src/app/core/models/gestion-courrier/cr-tache';
import { EditComponent } from 'src/app/modules/gestion-courrier/tache/edit/edit.component';
import { ItemSelectHelper } from 'src/app/shared/state';

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


    is_loading_schema = false;
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
      this.is_loading_schema = true;
      this.filterStatutHelper.addSelectedItem(
        [CrTacheStatut.traitement, CrTacheStatut.attente, CrTacheStatut.valide, CrTacheStatut.nonvalide]
      )
      const service = new CrTacheFactory();
      this.subscription.add(service.list(
        new QueryOptions(
          [
            {or: false, filters: [
              new Filter('is_ins', 1, 'eq'),
            ]}
          ],
          ['responsables', 'structures', 'inscription'],
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

    onShowCreateTacheForm() {
      const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Creer:`;
      modalRef.componentInstance.newItem.subscribe(
        (data) => {
          data.statut = 'En attente';
          const taches = this._taches$.value ? this._taches$.value : [] ;
          taches.unshift(data);
          this._taches$.next(taches);
          this.changeIndicator++;
        }
      );
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
      const modalRef = this.modalService.open(AffectationTacheEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
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


    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }

}
