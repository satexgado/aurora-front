import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from 'src/app/shared/base-component/base-list.component';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
})
export class NotificationsListComponent
  extends BaseListComponent
  implements OnInit
{
  page = 1;
  constructor(
    public notificationService: NotificationsService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(notificationService, route, 'notifications', 6);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 1 >=
      event.target.scrollHeight
    ) {
      if (!this.loading && this.notificationService.hasNextPage) this.getData();
    }
  }

  getData(): void {
    this.loading = true;
    this.notificationService
      .getData(this.page > 1, {
        page: this.page++,
        per_page: this.itemsPerPage,
      })
      .subscribe({
        complete: () => {
          this.loading = false;
        },
      });
  }

  navigate(link: string)  {
    console.log(link);
    if(!link) {
      return;
    }
    this.router.navigate([link]);
  }
}
