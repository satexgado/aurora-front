import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppTitleService, CacheService } from 'src/app/shared/services';

@Component({
  selector: 'app-user-details-home',
  templateUrl: './ud-home.component.html',
})
export class UserDetailsHomeComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input()  set initUser(user: any) {
        this.user = user;
    };

    user: any;
    is_loading_content = true;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        private router: Router,
        public route: ActivatedRoute,
        protected cdRef:ChangeDetectorRef,
    ) { }

    ngOnInit() {
      let sub = this.route.parent.data.subscribe((data: { user: any }) =>
      {
        if((!data.user))
        {
          this.router.navigate(['/user']);
          return;
        }

        this.is_loading_content = true;
        this.titleservice.setTitle(data.user.libelle);
        this.user = data.user;
      });

      this.subscription.add(sub);
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.user = null;
    }

}
