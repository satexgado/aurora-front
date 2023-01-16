import { PresenceService } from './../../../presence/presence.service';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { User } from 'src/app/express-courrier/users/user.model';
import { Helper } from 'src/app/helpers/helper/helper';
import { BaseSoloComponent } from 'src/app/shared/base-component/base-solo.component';
import { Discussion } from '../discussion.model';
import { DiscussionService } from '../discussion.service';

type Correspondant = User | Structure;

@Component({
  selector: 'app-discussion-solo',
  templateUrl: './discussion-solo.component.html',
  styleUrls: ['./discussion-solo.component.scss'],
})
export class DiscussionSoloComponent
  extends BaseSoloComponent<Discussion>
  implements OnInit
{
  @Input() discussion!: Discussion;
  correspondant!: Correspondant;
  structure: Structure | undefined;

  constructor(
    public discussionService: DiscussionService,
    public authService: AuthService,
    public helper: Helper,
    public presenceService: PresenceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions['discussion'] =
      this.discussionService.structure$.subscribe((structure) => {
        this.structure = structure;
      });

    this.correspondant = Discussion.getCorrespondant(
      this.discussion,
      this.structure ? this.structure : this.authService.user
    );
  }

  isUser(correspondant: Correspondant): correspondant is User {
    return User.isUser(correspondant);
  }

  isCorrespondantOnline() {
    if (this.isUser(this.correspondant))
      return this.presenceService.checkPresence(this.correspondant);

    return false;
  }
}
