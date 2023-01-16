import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit, HostListener, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/shared';
import { User } from 'src/app/shared/state/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  user$: Observable<User>;

  constructor( private loginService: AuthService, private authService: AuthenticationService) {
    // this.user$ = this.loginService.userInfo$;
  }

  ngOnInit() {


  }

  logout() {
    this.loginService.logOut()
    .subscribe((res) => {
      this.authService.logout()
    });
  }

}
