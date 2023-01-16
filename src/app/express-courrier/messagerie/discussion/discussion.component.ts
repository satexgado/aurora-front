import { ReactionsService } from './../reactions/reactions.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseContainerComponent } from 'src/app/shared/base-component/base-container.component';
import { Structure } from '../../structure/structure/structure.model';
import { DiscussionService } from './discussion.service';
import { Reaction } from './../reactions/reaction.model';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
})
export class DiscussionComponent
  extends BaseContainerComponent
  implements OnInit
{
  @Input() structure: Structure | undefined;

  constructor(
    public discussionService: DiscussionService,
    public reactionService: ReactionsService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(discussionService, router, route, 'discussion');
  }

  ngOnInit(): void {
    if (this.structure) this.discussionService.structure = this.structure;

    this.subscriptions['reactionsFetched'] =
      this.reactionService.dataFetched$.subscribe((item) => {
        const discussion = this.discussionService.findItemInDataByID(
          item.discussionId
        );
        if (discussion) {
          discussion.nombre_reaction_non_lus = 0;
          this.discussionService.emitData();
        }
      });

    this.subscriptions['reactionCreated'] =
      this.reactionService.lastItemcreated$.subscribe((reaction: Reaction) => {
        const discussion = {
          ...this.discussionService.findItemInDataByID(reaction.discussion),
        };

        this.discussionService.deleteItemInData(discussion.id);

        this.discussionService.unshiftItemInData(discussion);
      });
  }
}
