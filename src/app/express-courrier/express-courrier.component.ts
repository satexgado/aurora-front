import { fader, slider, stepper, transformer } from './route-animation';
import { UserPresent } from './presence/user-present.model';
import { User } from 'src/app/express-courrier/users/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { echo } from 'src/config/laravel-echo-config';
import { Helper } from '../helpers/helper/helper';
import { Storage } from '../helpers/storage/storage';
import { AuthService } from './auth/auth.service';
import { NotificationsService } from './notifications/notifications.service';
import { InboxService } from './inbox/inbox.service';
import { PresenceService } from './presence/presence.service';
import { ActivatedRoute, Event, IsActiveMatchOptions, NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-express-courrier',
  templateUrl: './aurora.component.html',
  styleUrls: ['./express-courrier.component.scss'],
  styles: [`
  .card-1-hoverable:hover {
      transition: all 3s cubic-bezier(.25, .8, .25, 1);
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }

    .nav-link3.active {
      background-color: antiquewhite;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }

    /*Card Footer Fixed*/
@supports (box-shadow: 2px 2px 2px black){
  .cart-panel-foo-fix{
    /* position: sticky; */
    bottom: 0;
    z-index: 9;
  }
}
  `],
  animations: [ // <-- add your animations here
    // fader,
    // slider,
    transformer,
    // stepper
  ],
})
export class ExpressCourrierComponent implements OnInit {
  newNotification = false;
  newInbox = false;
  notificationSubscription: Subscription;
  // inboxSubscription: Subscription;
  currentTopBar = 'default';

  public linkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'exact',
    queryParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };

  constructor(
    public authService: AuthService,
    public helper: Helper,
    public storage: Storage,
    public notificationService: NotificationsService,
    public inboxService: InboxService,
    public presenceService: PresenceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.setTopBar();
          break;
        }
        default: {
          break;
        }
      }
  });
  }

  setTopBar() {
    if(this.activatedRoute.firstChild && this.activatedRoute.firstChild.routeConfig && this.activatedRoute.firstChild.routeConfig.data) {
     return this.currentTopBar = this.activatedRoute.firstChild.routeConfig.data.topbar;
    }
    this.currentTopBar = 'default';
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit(): void {
    this.notificationSubscription =
      this.notificationService.lastItemcreated$.subscribe(() => {
        this.newNotification = true;
      });

    // this.inboxSubscription = this.inboxService.newDiscussion$.subscribe(
    //   (element) => {
    //     this.newInbox = true;
    //   }
    // );

    this.subscribeToConnectedChannel();
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
