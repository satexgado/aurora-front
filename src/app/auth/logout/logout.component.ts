import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
  	private authService: AuthenticationService,
    private loginService: AuthService,
  ) { }

  ngOnInit() {
  	this.loginService.logOut()
      .subscribe(() => {
        this.authService.logout()
      });
  }

}
