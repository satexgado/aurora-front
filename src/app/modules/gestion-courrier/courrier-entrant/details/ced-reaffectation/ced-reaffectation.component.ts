import { AffectationEditComponent } from './../../../courrier-shared/affectation/affectation.component';
import { CrReaffectation, ICrReaffectation } from './../../../../../core/models/gestion-courrier/cr-reaffectation';
import { CrReaffectationFactory } from 'src/app/core/services/gestion-courrier/cr-reaffectation';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-courrier-details-reaffectation',
  templateUrl: './ced-reaffectation.component.html',
  styleUrls: ['../ced-my-task/ced-my-task.component.css']
})
export class CourrierEntrantDetailsReaffectationComponent implements OnDestroy {

    subscription: Subscription = new Subscription();

    @Input()  set initCourrier(courrier: ICrCourrier) {
        this.courrier = courrier;
        this.is_loading_schema = true;
        const service = new CrReaffectationFactory();
        service.list(
          new QueryOptions(
            [
              {or: false, filters: [
                new Filter('courrier_id', this.courrier.id, 'eq'),
              ]}
            ],
            [],
            undefined,
            undefined,
            [new Sort('created_at','DESC')]
          )
        ).subscribe(
            (data)=> {
              this.reaffectations = data.data;
              this.cdRef.detectChanges();
              this.is_loading_schema = false;
            })
    };
    courrier: ICrCourrier;
    is_loading_schema = false;
    reaffectations: ICrReaffectation[] = [];

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        public router: Router,
        public authService: AuthService,
        public route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
        public helper: Helper,
    ) { }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.courrier = null;
    }

    onShowAffectationForm() {
      const modalRef = this.modalService.open(AffectationEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
      const instance = modalRef.componentInstance as AffectationEditComponent;
      instance.isUpdating = false;
      instance.title = 'Affecté à';
      const item = new CrReaffectation();
      item.courrier_id = this.courrier.id;
      instance.item = item;

      instance.newItem.pipe(
      ).subscribe(
        (data) => {
          this.reaffectations.unshift(data);
          // const service = new RREtendueFactory();
          // service.attachAffectation(newItemid, data.relationName+'s', data.relationId).subscribe();
        }
      );
    }

    onValidateReaffectation( reaffectation: ICrReaffectation, confirmation = true ) {
      if(confirmation)  {
        reaffectation.confirmation = 1;
        reaffectation.annulation = 0;
      } else {
        reaffectation.confirmation = 0;
        reaffectation.annulation = 1;
      }

      const service = new CrReaffectationFactory();
      service.update(reaffectation).subscribe(
        (data)=> {
          reaffectation = data;
        }
      );

    }

    onDeleteReaffectation(item: ICrReaffectation) {

      const libelle =  item.libelle;
      const reaffectations = this.reaffectations ? this.reaffectations : [] ;
      const index = reaffectations.findIndex(element => element.id === item.id);
      const cancelDelete = () => {
        const service = new CrReaffectationFactory();
        service.restore(item.id).subscribe(
            (data) => {
              reaffectations.splice(index, 0, data);
              this.reaffectations = reaffectations;
              this.notificationService.onInfo("La suppression a été annuler");
            }, () => {
            }
          );
      };


      this.notificationService.title = 'Suppréssion';
      this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + " l' affectation ";

      const confirm = () => {
        const service = new CrReaffectationFactory();
        service.delete(item.id).subscribe(
            () => {
              this.notificationService.onCancel(cancelDelete, "L'élément '"+libelle+"' a été supprimé" ,'Suppression' , 'success', 'Annuler la suppresion');
            }, () => {
              this.notificationService.onInfo('l\'élément est utilisé');
            }
          );
          reaffectations.splice(index,1);
          this.reaffectations = reaffectations;
      };

      const cancel = () => {
      };

      this.notificationService.bodyMaxLength = 300;
      this.notificationService.backdrop =  0;
      this.notificationService.onConfirmation(confirm, cancel);

      this.notificationService.bodyMaxLength = 80;
      this.notificationService.backdrop =  -1;
    }
}
