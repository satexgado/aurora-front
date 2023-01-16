import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { ClotureCourrierEditComponent } from '../../courrier-entrant/cloture-edit/edit.component';

@Component({
  selector: 'app-courrier-sortant-details',
  templateUrl: './courrier-sortant-details.component.html',
  styleUrls: ['./courrier-sortant-details.component.scss'],
})
export class CourrierSortantDetailsComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input('courrier')  set initCourrier(courrier: ICrCourrierSortant) {
        this.courrier = courrier;
    };

    @Output() updatedItem = new EventEmitter<any>();
    courrier: ICrCourrierSortant;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        protected modalService: NgbModal
    ) { }

    ngOnInit() {
      let sub = this.route.data.subscribe((data: { courrier: ICrCourrierSortant }) =>
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
        (data) => {
          Object.assign(this.courrier,data);
        }
      );
    }
}
