import { Component, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { CrTacheStatut, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import * as moment from 'moment';

@Component({
  selector: 'app-gestionnaire-tache-kanban',
  templateUrl: './tache-kanban.component.html',
  styleUrls: ['./tache-kanban.component.css']
})
export class GestionnaireTacheKanbanComponent  {

    subscription: Subscription = new Subscription();
    taches_traitement: ICrTache[] = [];
    taches_enattente: ICrTache[] = [];
    taches_valider: ICrTache[] = [];
    taches_non_valider: ICrTache[] = [];
    @Input('taches$') set initTaches(taches$: Observable<ICrTache[]>) {
      this.taches$ = taches$;
      this.taches$.subscribe(
        (data)=> {
          this.taches_traitement = data.filter(element => element.statut==CrTacheStatut.traitement);
          this.taches_enattente = data.filter(element => element.statut==CrTacheStatut.attente);
          this.taches_valider = data.filter(element => element.statut==CrTacheStatut.valide);
          this.taches_non_valider = data.filter(element => element.statut==CrTacheStatut.nonvalide);
          this.cdRef.detectChanges();
        })
    }

    @Input('filterStatut$') filterStatut$: Observable<CrTacheStatut[]>;

    taches$: Observable<ICrTache[]>;
    CrTacheStatut = CrTacheStatut;

    @Output() tacheUpdateFormEmitter = new EventEmitter<ICrTache>();
    @Output() tacheDeleteEmitter = new EventEmitter<ICrTache>();
    @Output() tacheAffectationFormEmitter = new EventEmitter<ICrTache>();
    @Output() tacheSoftUpdateEmitter = new EventEmitter<ICrTache>();

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        public router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
    ) { }


    onShowUpdateTacheForm(item: ICrTache) {
      this.tacheUpdateFormEmitter.emit(item);
    }

    onShowAffectationTacheForm(item: ICrTache) {
      this.tacheAffectationFormEmitter.emit(item);
    }

    drop(event: CdkDragDrop<ICrTache[]>, statut: CrTacheStatut) {
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
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        this.tacheSoftUpdateEmitter.emit(item);
      }
    }

    getTacheAffectation(item: ICrTache) {
      return [...item.responsables, ...item.structures]
    }

    onDeleteTache(item: ICrTache) {
      this.tacheDeleteEmitter.emit(item);
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
