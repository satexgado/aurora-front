import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseCreateComponent } from '../../../shared/base-component/base-create.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-password-edit',
  templateUrl: './user-password-edit.component.html',
  styleUrls: ['./user-password-edit.component.scss'],
})
export class UserPasswordEditComponent
  extends BaseCreateComponent
  implements OnInit
{
  constructor(public userService: UsersService) {
    super(userService);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(...args: any): void {
    this.form = this.fb.group({
      ancien_mdp: [null, Validators.required],
      nouveau_mdp: [null, Validators.required],
      nouveau_mdp_confirmation: [null, Validators.required],
    });
  }

  create() {
    if (this.form.valid) {
      this.loading = true;
      this.userService.updatePassword(this.form.value).subscribe(() => {
        this.loading = false;
        this.form.reset();
        this.created.emit();
        this.helper.notification.alertSuccess();
      });
    }
  }
}
