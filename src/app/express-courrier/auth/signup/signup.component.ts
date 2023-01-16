import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

interface Panel {
  welcome: boolean;
  userEdit: boolean;
  password: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignupComponent implements OnInit {
  loading = false;
  panel: Panel = {
    welcome: true,
    userEdit: false,
    password: false,
  };
  constructor(
    public route: ActivatedRoute,
    public userService: UsersService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) =>
      this._checkRegistrationInformation(params)
    );
  }

  showPanel(panel: 'welcome' | 'userEdit' | 'password') {
    this._resetPanel();
    this.panel[panel] = true;
  }

  private _resetPanel() {
    Object.keys(this.panel).forEach(
      (panel) => (this.panel[panel as keyof Panel] = false)
    );
  }

  private _checkRegistrationInformation(params: Params) {
    this.loading = true;
    this.authService.checkUserInformation(params).subscribe(
      (response) => {
        this.userService.singleData = response;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.router.navigate(['bad-url']);
        }
      }
    );
  }
}
