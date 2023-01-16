import { Discussion } from './../discussion.model';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DiscussionService } from '../discussion.service';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { InfiniteScrollable } from 'src/app/shared/interfaces/InfiniteScrollable';
import { Structure } from './../../../structure/structure/structure.model';
import { echo } from './../../../../../config/laravel-echo-config';
import { User } from './../../../users/user.model';
import { AuthService } from './../../../auth/auth.service';

@Component({
  selector: 'app-discussion-list',
  templateUrl: './discussion-list.component.html',
  styleUrls: ['./discussion-list.component.scss'],
})
export class DiscussionListComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, InfiniteScrollable
{
  page = 1;
  per_page = 10;
  research$ = new Subject<string>();
  @ViewChild('search', { static: true }) search!: ElementRef;

  structure: Structure | undefined;

  constructor(
    public discussionService: DiscussionService,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {
    super(discussionService);
  }

  ngOnInit(): void {
    if (this.discussionService.structure) {
      this.subscriptions['structure'] =
        this.discussionService.structure$.subscribe((structure) => {
          this.structure = structure;
        });
    }

    this.route.queryParams.subscribe((params) => {
      const { search, ...autres } = params;

      this.page = 1;

      if (search) {
        this.getData({ search });
      } else if (search == null) {
        this.getData();
      } else {
        this.router.navigate([this.helper.navigation.getCurrentUrl()], {
          queryParams: { search: null },
          queryParamsHandling: 'merge',
        });
      }
    });

    this.research$.pipe(debounceTime(1500)).subscribe((keyword) => {
      this.router.navigate([this.helper.navigation.getCurrentUrl()], {
        queryParams: { search: keyword },
        queryParamsHandling: 'merge',
      });
    });

    this.subscribeToChannel();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.search && !this.search.nativeElement.value) {
        this.search.nativeElement.value = params.search;
      }
    });
  }

  subscribeToChannel(): void {
    echo
      .private('inbox')
      .listen('InboxMessageEvent', (element: { discussion: Discussion }) => {
        const discussion = element.discussion;

        if (
          ((discussion.correspondance.user as User)?.id ==
            this.authService.user.id ||
            (discussion.correspondance.user1 as User)?.id ==
              this.authService.user.id ||
            (discussion.correspondance.user2 as User)?.id ==
              this.authService.user.id) &&
          (discussion.derniere_reaction.inscription as User).id !=
            this.authService.user.id
        ) {
          this.discussionService.addNewDiscussion(discussion);
        }
      });
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 1 >=
      event.target.scrollHeight
    ) {
      if (!this.loading && this.discussionService.hasNextPage)
        this.getData(
          this.search.nativeElement.value
            ? { search: this.search.nativeElement.value }
            : undefined
        );
    }
  }

  getData(params?: Params): void {
    this.loading = true;

    this.discussionService
      .getData(this.structure, this.page > 1, {
        page: this.page++,
        per_page: this.per_page,
        ...params,
      })
      .subscribe((response) => {
        this.loading = false;
      });
  }
}
