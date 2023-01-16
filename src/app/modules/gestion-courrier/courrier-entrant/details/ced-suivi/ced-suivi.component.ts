import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { CrCourrierEtapeFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-etape';
import { ICrCourrierEtape } from 'src/app/core/models/gestion-courrier/cr-courrier-etape';
import { CourrierEtapeStatutEditComponent } from '../ced-courrier-etape-statut/edit.component';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';

@Component({
  selector: 'app-courrier-details-suivi',
  templateUrl: './ced-suivi.component.html',
  styleUrls: ['./ced-suivi.component.css']
})
export class CourrierEntrantDetailsSuiviComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input()  set initCourrier(courrier: ICrCourrier) {
        this.courrier = courrier;
        this.is_loading_schema = true;
        const service = new CrCourrierEtapeFactory();
        service.list(
          new QueryOptions(
            [
              {or: false, filters: [
                new Filter('courrier_id', this.courrier.id, 'eq')
              ]}
            ],
            ['responsable', 'structure'],
            undefined,
            undefined,
            [new Sort('created_at','ASC')]
          )
        ).subscribe(
            (data)=> {
              this.etapes = data.data;
              this.cdRef.detectChanges();
              this.is_loading_schema = false;
            })
    };

    courrier: ICrCourrier;
    is_loading_schema = false;
    etapes: ICrCourrierEtape[] = [];

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        public router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
    ) { }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.courrier = null;
    }

    onShowUpdateSchemaForm(item: ICrCourrierEtape) {
      const modalRef = this.modalService.open(CourrierEtapeStatutEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Modifier: ${item.libelle}`;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data) => {
           this.etapes = this.etapes.map(element => {
            if (element.id === data.id ) {
                element = data;
            }
            return element;
          });
        }
      );
    }
}
