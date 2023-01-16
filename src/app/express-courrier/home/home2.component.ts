import { UserPresent } from './../presence/user-present.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { echo } from 'src/config/laravel-echo-config';
import { NotificationsService } from '../notifications/notifications.service';
import { InboxService } from '../inbox/inbox.service';
import { PresenceService } from '../presence/presence.service';
import { Helper } from '../../helpers/helper/helper';
@Component({
  selector: 'app-home',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss'],
  styles: [`
  .display-5{
      font-size: 2.5rem;
    }
    .huge {
      font-size: 40px;
      line-height: normal;
    }
    @media(max-width:1470px) {
      .huge {
        font-size: 40px;
        line-height: normal;
      }
    }
    @media(max-width:1024px) {
      .huge {
        font-size: 27px;
        line-height: normal;
      }
      .fa-5x {
        font-size: 3em;
      }
    }
    a:hover {
      color: transparent;
    }

    /*Card Footer Fixed*/
    @supports (box-shadow: 2px 2px 2px black){
      .cart-panel-foo-fix{
        position: sticky;
        bottom: 0;
        z-index: 9;
      }
    }

    .avatar-home {
      height: 150px;
width: 150px;
object-fit: cover;
border-radius: 50%;
border: 1px solid #1a5276;
    }
  `]
})
export class HomeComponent implements OnInit {
  newNotification = false;
  newInbox = false;
  notificationSubscription: Subscription;
  inboxSubscription: Subscription;

  constructor(
    public authService: AuthService,
    public notificationService: NotificationsService,
    public inboxService: InboxService,
    public presenceService: PresenceService,
    public helper: Helper,
    ) { }

  ngOnInit(): void {
    this.notificationSubscription =
      this.notificationService.lastItemcreated$.subscribe(() => {
        this.newNotification = true;
      });

    this.inboxSubscription = this.inboxService.newDiscussion$.subscribe(
      (element) => {
        // console.log(element);
        this.newInbox = true;
      }
    );

    this.subscribeToConnectedChannel();
    console.log(this.helper.authorisation.getAll());
    console.log(this.helper.authorisation.checkIfUserIsAdmin());
  }

  subscribeToConnectedChannel() {
    echo
      .join('online')
      .here((users: UserPresent[]) => {
        this.presenceService.setUpPresence(users);
      })
      .joining((user: UserPresent) => {
        this.presenceService.addNewPresence(user);
      })
      .leaving((user: UserPresent) => {
        this.presenceService.deletePresence(user);
      })
      .error((err: any) => {
        console.log(err);
      });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.helper.navigation.navigate(['authentification']);
    });
  }
}
