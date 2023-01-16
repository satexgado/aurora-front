import { Helper } from 'src/app/helpers/helper/helper';
import { PresenceService } from './../../presence/presence.service';
import { User } from './../../users/user.model';
import {
  Discussion,
  Correspondant,
} from './../../messagerie/discussion/discussion.model';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-inbox-solo',
  templateUrl: './inbox-solo.component.html',
  styleUrls: ['./inbox-solo.component.scss'],
})
export class InboxSoloComponent implements OnInit {
  @Input() inbox: Discussion;
  correspondant: Correspondant;

  constructor(
    public helper: Helper,
    public authService: AuthService,
    public presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.correspondant = Discussion.getCorrespondant(
      this.inbox,
      this.authService.user
    );
  }

  isUser(correspondant: Correspondant): correspondant is User {
    return User.isUser(correspondant);
  }

  isUserOnline() {
    if (this.isUser(this.correspondant)) {
      return this.presenceService.checkPresence(this.correspondant);
    }

    return false;
  }
}
