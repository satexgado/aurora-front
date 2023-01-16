import { Component, OnInit } from '@angular/core';
import { UsersService } from './../users.service';
import { User } from './../user.model';
import { BaseSingleComponent } from './../../../shared/base-component/base-single.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-user-show',
  templateUrl: './user-show.component.html',
  styleUrls: ['./user-show.component.scss'],
})
export class UserShowComponent
  extends BaseSingleComponent<User>
  implements OnInit
{
  editing = false;
  constructor(
    public authService: AuthService,
    public userService: UsersService,
    public route: ActivatedRoute
  ) {
    super(userService, route);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id == this.authService.user.id) {
        this.single = this.authService.user;
        this.userService.singleData = this.authService.user;
      } else {
        this.loading = true;
        this.getUserById(+params.id);
      }
    });
  }

  getUserById(userId: number): void {
    this.loading = true;
    this.userService.show(userId).subscribe((user) => {
      this.single = user;
      this.loading = false;
    });
  }

  edit(): void {
    this.editing = true;
    this.helper.modal.show('user-edit-modal');
  }

  onEdited(): void {
    this.helper.modal.hide('user-edit-modal');
  }
}
