import { IService } from 'src/app/core/models/service.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html'
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {

    subscription: Subscription = new Subscription();
    service: IService;
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      protected titleService: AppTitleService,
      protected modalService: NgbModal,
      protected notificationService: NotificationService,
    ) {

    }

    ngOnInit() {
      const sub = this.route.data
      .subscribe((data: { service: IService }) => {
          if (!data.service) {
            this.router.navigate(['/config/service']);
            return;
          }

          this.titleService.setTitle(data.service.libelle);
          this.service = data.service;
        });
      this.subscription.add(sub);
    }

  ngOnDestroy() {
      this.subscription.unsubscribe();
      this.service = null;
  }

}
