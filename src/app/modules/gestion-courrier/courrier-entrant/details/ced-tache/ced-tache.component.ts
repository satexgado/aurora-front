import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { AffectationTacheEditComponent } from './../../../tache/affectation/affectation.component';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { CrTache, CrTacheStatut, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditComponent } from '../../../tache/edit/edit.component';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import * as moment from 'moment';

@Component({
  selector: 'app-courrier-details-tache',
  templateUrl: './ced-tache.component.html',
  styleUrls: ['./ced-tache.component.css']
})
export class CourrierEntrantDetailsTacheComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    taches_traitement: ICrTache[] = [];
    taches_enattente: ICrTache[] = [];
    taches_valider: ICrTache[] = [];
    taches_non_valider: ICrTache[] = [];
    nomTache: string;

    @Input()  set initCourrier(courrier: ICrCourrier) {
        this.courrier = courrier;
        this.is_loading_schema = true;
        const service = new CrTacheFactory();
        service.list(
          new QueryOptions(
            [
              {or: false, filters: [
                new Filter('courrier_id', this.courrier.id, 'eq'),
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
              this.taches = data.data;
              this.taches_traitement = data.data.filter(element => element.statut==CrTacheStatut.traitement);
              this.taches_enattente = data.data.filter(element => element.statut==CrTacheStatut.attente);
              this.taches_valider = data.data.filter(element => element.statut==CrTacheStatut.valide);
              this.taches_non_valider = data.data.filter(element => element.statut==CrTacheStatut.nonvalide);
              this.cdRef.detectChanges();
              this.is_loading_schema = false;
            })
    };
    courrier: ICrCourrier;
    is_loading_schema = false;
    taches: ICrTache[] = [];

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
      // let sub = this.route.parent.data.subscribe((data: { courrier: ICrCourrierEntrant | ICrCourrierSortant }) =>
      // {
      //   if((!data.courrier))
      //   {
      //     this.router.navigate(['/courrier']);
      //   }

      //   this.is_loading_schema = true;
      //   this.titleservice.setTitle(data.courrier.courrier.libelle);
      //   this.initCourrier = data.courrier.courrier;
      // });

      // this.subscription.add(sub);
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.courrier = null;
    }

    quickCreation() {
      if(!this.nomTache) {
        return;
      }

      this.is_loading_schema = true;

      // let tache = new CrTache();
      // tache.libelle = this.nomTache;
      // tache.courrier_id = this.courrier.id;
      const service = new CrTacheFactory();
      service.create({
        libelle: this.nomTache,
        courrier_id: this.courrier.id
      }).subscribe(
        (data)=>{
          this.taches_enattente.unshift(data);
          this.is_loading_schema = false;
          this.nomTache = '';
        }
      )
    }

    onShowCreateTacheForm() {
      const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Creer:`;
      modalRef.componentInstance.courrier_id = this.courrier.id;
      modalRef.componentInstance.newItem.subscribe(
        (data) => {
          this.taches_enattente.unshift(data);
        }
      );
    }

    onShowUpdateTacheForm(item: ICrTache) {
      const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Modifier: ${item.libelle}`;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data) => {
          Object.assign(item,data);
        }
      );
    }

    onShowAffectationTacheForm(item: ICrTache) {
      const modalRef = this.modalService.open(AffectationTacheEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Collaborateur`;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data: ICrTache) => {
          Object.assign(item,data);
        }
      );
    }

    drop(event: CdkDragDrop<ICrTache[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        let item = event.previousContainer.data[event.previousIndex];
        switch(event.container.id) {
          case 'cdk_drop_en_attente':
            item.statut = CrTacheStatut.attente;
          break;
          case 'cdk_drop_traitement':
            item.statut = CrTacheStatut.traitement;
          break;
          case 'cdk_drop_valider':
            item.statut = CrTacheStatut.valide;
          break;
          default: item.statut = CrTacheStatut.nonvalide;
        }
        this.is_loading_schema = true;
        const service = new CrTacheFactory();
        service.update(item).subscribe(
          (data)=> {
            this.is_loading_schema = false;
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex,
            );
          }
        )
      }
    }

    getTacheAffectation(item: ICrTache) {
      return [...item.responsables, ...item.structures]
    }

    onDeleteTache(item: ICrTache, currentTable: ICrTache[], index: number) {
      
      const libelle =  item.libelle;
      this.notificationService.title = 'Suppréssion';
      this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + item.libelle;

      const cancelDelete = () => {
        const service = new CrTacheFactory();
        service.restore(item.id).subscribe(
            (data) => {
              currentTable.splice(index,0, data)
              this.notificationService.onInfo("La suppression a été annuler");
            }, () => {
            }
          );
      };

      const confirm = () => {
        const service = new CrTacheFactory();
        service.delete(item.id).subscribe(
            () => {
              this.notificationService.onCancel(cancelDelete, "L'élément '"+libelle+"' a été supprimé" ,'Suppression' , 'success', 'Annuler la suppresion');
            }, () => {
              this.notificationService.onInfo('l\'élément est utilisé');
            }
          );
        currentTable.splice(index,1);
      };

      const cancel = () => {
      };

      this.notificationService.bodyMaxLength = 300;
      this.notificationService.backdrop =  0;
      this.notificationService.onConfirmation(confirm, cancel);

      this.notificationService.bodyMaxLength = 80;
      this.notificationService.backdrop =  -1;
    }

  trackByFn(index, item) {
      return item.id; // or index
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
