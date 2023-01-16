import { ImageHandlerService } from './../../../../helpers/file-handlers/image-handler.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { PresenceService } from 'src/app/express-courrier/presence/presence.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { User } from 'src/app/express-courrier/users/user.model';
import { BaseSingleComponent } from 'src/app/shared/base-component/base-single.component';
import { ReactionsService } from '../../reactions/reactions.service';
import { Correspondance, Correspondant, Discussion } from '../discussion.model';
import { DiscussionService } from '../discussion.service';

@Component({
  selector: 'app-discussion-show',
  templateUrl: './discussion-show.component.html',
  styleUrls: ['./discussion-show.component.scss'],
})
export class DiscussionShowComponent
  extends BaseSingleComponent
  implements OnInit
{
  correspondant!: Correspondant;
  structure: Structure | undefined;
  fichiers: any[];
  constructor(
    public discussionService: DiscussionService,
    public authService: AuthService,
    public reactionService: ReactionsService,
    public route: ActivatedRoute,
    public presenceService: PresenceService,
    public imageHandlerService: ImageHandlerService

  ) {
    super(discussionService, route);
  }

  ngOnInit(): void {
    this.enableFetchDataFromURL = true;
    super.ngOnInit();

    this.subscriptions['structure'] =
      this.discussionService.structure$.subscribe((structure) => {
        this.structure = structure;
      });

    this.subscriptions['reaction-created'] =
      this.reactionService.lastItemcreated$.subscribe((reaction) => {
        // Update discussion
        const discussion = this.discussionService.findItemInDataByID(
          reaction.discussion
        );

        if (discussion) {
          discussion.derniere_reaction = reaction;
        }
      });

    this.subscriptions['reaction-deleted'] =
      this.reactionService.lastItemDeleted$.subscribe((reaction) => {
        // Update discussion
        const discussion = this.discussionService.findItemInDataByID(
          reaction.discussion
        );

        if (discussion && discussion.derniere_reaction.id == reaction.id) {
          discussion.derniere_reaction = this.reactionService.data[0];
        }
      });

    this.subscriptions['discussion'] =
      this.discussionService.singleData$.subscribe((discussion) => {
        this.correspondant = Discussion.getCorrespondant(
          discussion,
          this.discussionService.structure
            ? this.structure
            : this.authService.user
        );
      });
      this.service.singleData$.subscribe(
        (single) => {
          if(!single) {
            return ;
          }
          this.reactionService.getFichierByDiscussion(single.id, null).subscribe(
            (data)=> {
              this.fichiers = data;
            }
          )
        }
      );

  }

  isUser(correspondant?: Correspondant): correspondant is User {
    return User.isUser(correspondant);
  }

  isOnline(correspondant: Correspondant): boolean {
    if (this.isUser(correspondant))
      return this.presenceService.checkPresence(correspondant);

    return false;
  }
}
