import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { Fichier, IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { BasicStoreMultipleFileComponent } from 'src/app/modules/gestion-document/fichier/store-fichier/edit.component';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-courrier-details_fichier',
  templateUrl: './ced-fichier.component.html',
})
export class CourrierEntrantDetailsFichierComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input()  set initCourrier(courrier: ICrCourrier) {
        this.courrier = courrier;
        const fichierService = new FichierFactory();
        fichierService.list(
          new QueryOptions(
            [
              {or: false, filters: [
                new Filter('courrier_id', this.courrier.id, 'eq')
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
    };

    courrier: ICrCourrier;
    fichiers: IFichier[];
    is_loading_content = true;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
        public helper: Helper,
    ) { }

    openFileModal() {
      const modalRef = this.modalService.open(BasicStoreMultipleFileComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      const instance = modalRef.componentInstance as BasicStoreMultipleFileComponent;
      if(this.courrier) {
        instance.relation_name = 'courriers';
        instance.relation_id = this.courrier.id;
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

    onDeleteFichier(fichier:IFichier) {
      const index = this.fichiers.findIndex(element => element.id === fichier.id);
      this.fichiers.splice(index, 1);
    }
}
