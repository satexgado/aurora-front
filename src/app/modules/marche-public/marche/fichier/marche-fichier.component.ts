import { IMpMarcheEtape } from 'src/app/core/models/marche-public/marche-etape.model';
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


@Component({
  selector: 'app-marche-details_fichier',
  templateUrl: './marche-fichier.component.html',
})
export class MarcheDetailsFichierComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input('etape')  set initMarcheEtape(marche: IMpMarcheEtape) {
        this.marche = marche;
        const fichierService = new FichierFactory();
        fichierService.list(
          new QueryOptions(
            [
              {or: false, filters: [
                new Filter('marche_id', this.marche.id, 'eq')
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

    marche: IMpMarcheEtape;
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
    ) { }

    openFileModal() {
      const modalRef = this.modalService.open(BasicStoreMultipleFileComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      const instance = modalRef.componentInstance as BasicStoreMultipleFileComponent;
      if(this.marche) {
        instance.relation_name = 'mp_marche_etapes';
        instance.relation_id = this.marche.id;
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
        this.marche = null;
    }

}
