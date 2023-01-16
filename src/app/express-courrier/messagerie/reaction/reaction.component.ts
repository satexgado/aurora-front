import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { Structure } from '../../structure/structure/structure.model';
import { DiscussionService } from '../discussion/discussion.service';
import { ReactionsService } from '../reactions/reactions.service';

@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss'],
})
export class ReactionComponent extends BaseComponent implements OnInit {
  @Input() structure: Structure | undefined;

  constructor(
    public reactionService: ReactionsService,
    public discussionService: DiscussionService
  ) {
    super(reactionService);
  }

  ngOnInit(): void {
    if (this.structure) this.reactionService.structure = this.structure;

    this.subscriptions['discussion'] =
      this.discussionService.singleData$.subscribe((discussion) => {
        this.reactionService.discussion$.next(discussion);
      });
  }
}
