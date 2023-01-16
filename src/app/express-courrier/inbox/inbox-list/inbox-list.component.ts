import { User } from './../../users/user.model';
import {
  Correspondant,
  Discussion,
} from './../../messagerie/discussion/discussion.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { InboxService } from './../inbox.service';
import { Component, OnInit } from '@angular/core';
import { DiscussionListComponent } from '../../messagerie/discussion/discussion-list/discussion-list.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-inbox-list',
  templateUrl: './inbox-list.component.html',
  styleUrls: ['./inbox-list.component.scss'],
})
export class InboxListComponent
  extends DiscussionListComponent
  implements OnInit
{
  constructor(
    public inboxService: InboxService,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
  ) {
    super(inboxService, router, route, authService);
  }

  ngOnInit(): void {
    this.per_page = 8;
    super.ngOnInit();

    // this.subscriptions['inbox'] = this.inboxService.newDiscussion$.subscribe((discussion) => {
    //   this.un
    // })
  }

  getCorrespondant(discussion: Discussion) {
    return Discussion.getCorrespondant(discussion, this.authService.user.id);
  }

  isUser(correpondant: Correspondant) {
    return User.isUser(correpondant);
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 1 >=
      event.target.scrollHeight
    ) {
      if (!this.loading && this.inboxService.hasNextPage) this.getData(null);
    }
  }

  getData(params?: Params): void {
    this.loading = true;

    this.inboxService
      .getData(this.structure, this.page > 1, {
        page: this.page++,
        per_page: this.per_page,
        ...params,
      })
      .subscribe(() => {
        this.loading = false;
      });
  }
}
