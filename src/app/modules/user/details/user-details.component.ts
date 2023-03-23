import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],

})
export class UserDetailsComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input('user')  set initUser(user: any) {
        this.user = user;
    };

    @Output() updatedItem = new EventEmitter<any>();
    user: any;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        protected modalService: NgbModal
    ) { }

    ngOnInit() {
      let sub = this.route.data.subscribe((data: { user: any }) =>
      {
        if((!data.user))
        {
          this.router.navigate(['/utilisateur']);
          return;
        }
        this.titleservice.setTitle(data.user.libelle);
        this.initUser = data.user;
      });
      this.subscription.add(sub);
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.user = null;
    }

}
