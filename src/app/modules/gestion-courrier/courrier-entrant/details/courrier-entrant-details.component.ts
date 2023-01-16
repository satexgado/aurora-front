import { ClotureCourrierEditComponent } from './../cloture-edit/edit.component';
import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { CrCourrierFactory } from 'src/app/core/services/gestion-courrier/cr-courrier';

@Component({
  selector: 'app-courrier-entrant-details',
  templateUrl: './courrier-entrant-details.component.html',
  styleUrls: ['./courrier-entrant-details.component.scss'],

})
export class CourrierEntrantDetailsComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input('courrier')  set initCourrier(courrier: ICrCourrierEntrant) {
        this.courrier = courrier;
    };

    @Output() updatedItem = new EventEmitter<any>();
    courrier: ICrCourrierEntrant;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        protected modalService: NgbModal
    ) { }

    ngOnInit() {
      let sub = this.route.data.subscribe((data: { courrier: ICrCourrierEntrant }) =>
      {
        if((!data.courrier))
        {
          this.router.navigate(['/courrier']);
        }
        this.titleservice.setTitle(data.courrier.libelle);
        this.initCourrier = data.courrier;
      });
      this.subscription.add(sub);
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.courrier = null;
    }

    onShowClotureCourrierForm() {
      const modalRef = this.modalService.open(ClotureCourrierEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.item = this.courrier.courrier;
      modalRef.componentInstance.title = 'Clore ce courrier'
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data: ICrCourrier) => {
          this.courrier.courrier.cloture_id = data.cloture_id;
          this.courrier.courrier.date_cloture  = data.date_cloture;
          this.courrier.courrier.message_cloture = data.message_cloture;
          this.courrier.courrier.cloture = data.cloture;
        }
      );
    }

    onReonpenCourrier() {

    this.notificationService.title = 'Suppréssion';

    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir réouvir le courrier?';

    const confirm = () => {
      const service = new CrCourrierFactory();
      service.update({
        id: this.courrier.courrier.id,
        reopenCourrier: 1
      }).subscribe(
        (data: ICrCourrier)=> {
          this.courrier.courrier.cloture_id = null;
          this.courrier.courrier.date_cloture  = null;
          this.courrier.courrier.message_cloture = null;
          this.courrier.courrier.cloture = null;
        }
      )
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
