import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { User } from 'src/app/express-courrier/users/user.model';
import { DocumentHandlerService } from 'src/app/helpers/file-handlers/document-handle.service';
import { ImageHandlerService } from 'src/app/helpers/file-handlers/image-handler.service';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { InfiniteScrollable } from 'src/app/shared/interfaces/InfiniteScrollable';
import { echo } from 'src/config/laravel-echo-config';
import { Discussion } from '../../discussion/discussion.model';
import { Reaction } from '../../reactions/reaction.model';
import { ReactionsService } from '../../reactions/reactions.service';

@Component({
  selector: 'app-reaction-list',
  templateUrl: './reaction-list.component.html',
  styleUrls: ['./reaction-list.component.scss'],
})
export class ReactionListComponent
  extends BaseComponent<Reaction>
  implements OnInit, InfiniteScrollable, AfterViewInit
{
  page = 1;
  per_page = 15;
  discussion: Discussion | undefined;
  scrollPos: number | undefined;

  constructor(
    public reactionService: ReactionsService,
    public imageHandlerService: ImageHandlerService,
    public documentService: DocumentHandlerService,
    public authService: AuthService,
    public route: ActivatedRoute
  ) {
    super(reactionService);
  }

  ngOnInit(): void {
    this.subscriptions['discussion'] =
      this.reactionService.discussion$.subscribe((discussion) => {
        if (this.discussion) {
          this.leaveChannel(discussion);
        }

        this.discussion = discussion;

        this.subscribeToChannel(discussion);

        // this.route.queryParams.subscribe((params) => {
        this.page = 1;
        this.getData(discussion);
        // });
      });

    this.subscriptions['data'] = this.reactionService.data$.subscribe(
      (data) => {
        this.data = data;
      }
    );
  }

  ngAfterViewInit(): void {
    this.scrollPos = 400;
  }
  onScroll() {
    if (this.reactionService.hasNextPage) {
      if (this.discussion) this.getData(this.discussion);
    }
  }

  getData(discussion: Discussion, params?: Params): void {
    this.loading = true;
    this.reactionService
      .getByDiscussion(this.page > 1, discussion.id!, {
        page: this.page++,
        per_page: this.per_page,
      })
      .subscribe({
        complete: () => {
          this.loading = false;
        },
      });
  }

  subscribeToChannel(discussion: Discussion): void {
    echo
      .private(`discussion-${discussion.id}-channel`)
      .listen('MessageSentEvent', (reaction: { reaction: Reaction }) => {
        this.reactionService.unshiftItemInData(reaction.reaction);
        this.reactionService.lastItemCreated = reaction.reaction;
      });
  }

  leaveChannel(discussion: Discussion): void {
    echo.leave(`discussion-${discussion.id}-channel`);
  }

  isUser(user: unknown): user is User {
    return User.isUser(user);
  }

  isStructure(structure: unknown): structure is Structure {
    return Structure.isStructure(structure);
  }
}
