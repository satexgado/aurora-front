import { Component, OnInit } from '@angular/core';
import { BaseSingleComponent } from '../../../shared/base-component/base-single.component';
import { User } from '../user.model';
import { UsersService } from './../users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent
  extends BaseSingleComponent<User>
  implements OnInit
{
  constructor(public userService: UsersService, public route: ActivatedRoute) {
    super(userService, route);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onEdited(form: FormData) {
    console.log('form');
    console.log(form);

    this.loading = true;
    this.userService.update(this.single.id, form).subscribe(() => {
      this.loading = false;
    });
  }
}
