import { MessageEditComponent } from './../../../zen-plume/message-edit/message-edit.component';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { Fichier, IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { BasicStoreMultipleFileComponent } from 'src/app/modules/gestion-document/fichier/store-fichier/edit.component';
import { EditComponent as CourrierSortantEditFormComponent} from '../../edit/edit.component'
import { AffectationCourrierEditComponent } from '../../affectation/affectation.component';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';

@Component({
  selector: 'app-courrier-details-hom',
  templateUrl: './ced-home.component.html',
})
export class CourrierEntrantDetailsHomeComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input()  set initCourrier(courrier: ICrCourrierEntrant) {
        this.courrier = courrier;
    };

    courrier: ICrCourrierEntrant;
    fichiers: IFichier[];
    is_loading_content = true;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected service: CrCourrierEntrantFactory,
        protected notificationService: NotificationService,
        private router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
    ) { }

    ngOnInit() {
      let sub = this.route.parent.data.subscribe((data: { courrier: ICrCourrierEntrant }) =>
      {
        if((!data.courrier))
        {
          this.router.navigate(['/courrier']);
        }

        this.is_loading_content = true;
        this.titleservice.setTitle(data.courrier.libelle);
        this.courrier = data.courrier;
        const fichierService = new FichierFactory();
        fichierService.list(
          new QueryOptions(
            [
              {or: false, filters: [
                new Filter('courrier_id', this.courrier.courrier.id, 'eq')
              ]}
            ],
            [
              'fichier_type', 'inscription', 'ged_element'
            ],
            undefined,
            undefined,
            [new Sort('libelle','ASC')]
          )
        ).subscribe(
            (data)=> {
              this.fichiers = data.data;
              this.cdRef.detectChanges();
              this.is_loading_content = false;
            })
      });

      this.subscription.add(sub);
    }

    openFileModal() {
      const modalRef = this.modalService.open(BasicStoreMultipleFileComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      const instance = modalRef.componentInstance as BasicStoreMultipleFileComponent;
      if(this.courrier) {
        instance.relation_name = 'courriers';
        instance.relation_id = this.courrier.courrier.id;
        instance.fichierEmitter.subscribe(
          (data)=> {
            if(!this.fichiers) {
              this.fichiers = [];
            }
            this.fichiers.unshift(data);
          }
        )
      }
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.courrier = null;
    }

    // onShowUpdateCourrierForm() {
    //   const modalRef = this.modalService.open(CourrierEntrantDetailsFormComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    //   modalRef.componentInstance.initCourrier = this.courrier;
    //   modalRef.componentInstance.isUpdating = true;
    //   modalRef.componentInstance.updatedItem.subscribe(
    //     (data) => {
    //       Object.assign(this.courrier,data);
    //     }
    //   );
    // }

    onShowUpdateCourrierForm() {
      const modalRef = this.modalService.open(CourrierSortantEditFormComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.item = this.courrier;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data) => {
          Object.assign(this.courrier,data);
        }
      );
    }

    onShowAffectationTacheForm() {
      const modalRef = this.modalService.open(AffectationCourrierEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Collaborateur`;
      modalRef.componentInstance.item = this.courrier.courrier;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data: ICrCourrier) => {
          Object.assign(this.courrier.courrier,data);
        }
      );
    }

}
