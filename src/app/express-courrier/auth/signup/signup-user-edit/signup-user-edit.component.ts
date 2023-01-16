import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { UsersService } from 'src/app/express-courrier/users/users.service';
import { BaseCreateComponent } from 'src/app/shared/base-component/base-create.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup-user-edit',
  templateUrl: './signup-user-edit.component.html',
  styleUrls: ['./signup-user-edit.component.scss'],
})
export class SignupUserEditComponent
  extends BaseCreateComponent
  implements OnInit
{
  @Output() suivant = new EventEmitter();
  conditionUtilisationChecked = false;
  constructor(
    public authService: AuthService,
    public userService: UsersService
  ) {
    super(authService);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      conditions_utilisations: [null, Validators.requiredTrue],
    });
  }

  onEdited(form: FormData): void {
    this.loading = true;

    this.formData = form;

    this.formData.append(
      'conditions_utilisations',
      this.form.controls.conditions_utilisations.value
    );

    this.authService
      .register(this.userService.singleData.id, this.formData)
      .subscribe(() => {
        this.helper.navigation.navigate(['/']);
      });
  }
}
