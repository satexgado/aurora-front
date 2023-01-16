import { InboxService } from './inbox.service';
import { User } from './../users/user.model';
import { Discussion } from './../messagerie/discussion/discussion.model';
import { echo } from './../../../config/laravel-echo-config';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit, OnDestroy {
  constructor(
    public authService: AuthService,
    public inboxService: InboxService
  ) {}

  ngOnInit(): void {
    this.subscribeToChannel();
  }

  ngOnDestroy(): void {
    this.leaveChannel();
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
          console.log(
            this.authService.user.nom_complet + ' receive the message '
          );
          // this.inboxService.addNewDiscussion(discussion);
          // this.playMessageSound();
        }
      });
  }

  leaveChannel(): void {
    echo.leave('inbox');
  }

  playMessageSound(): void {
    const messageSound = new Audio('assets/audio/message.ogg');
    messageSound.play();
  }
}
