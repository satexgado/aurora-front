import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxPicaImageService, NgxPicaService } from '@digitalascetic/ngx-pica';
import { UsersCreateComponent } from '../users-create/users-create.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss'],
})
export class UsersEditComponent extends UsersCreateComponent implements OnInit {
  @Input() showPasswordFields = false;
  user: any;

  @Output() edited = new EventEmitter<FormData>();
  @Input() submitDisabled = true;
  @Input() loading = false;

  constructor(
    public userService: UsersService,
    public ngxPicaService: NgxPicaService,
    public ngxPicaImageService: NgxPicaImageService
  ) {
    super(userService, ngxPicaService, ngxPicaImageService);
  }

  ngOnInit(): void {
    this.subscriptions['user'] = this.userService.singleData$.subscribe(
      (user) => {
        this.user = user;

        this.initForm(user);
      }
    );

    this.submitDisabled = false;
  }

  initForm(user: any): void {
    super.initForm(user);

    if (this.showPasswordFields) {
      this.addControls(
        ['password', 'password_confirmation'],
        [null, null],
        [true, true]
      );

      this.form.controls.password_confirmation.valueChanges.subscribe(
        (text) => {
          if (text !== this.formValue('password')) {
            this.form.controls.password_confirmation.setErrors({
              notMatchWithPassword: true,
            });
          }
        }
      );
    }
  }

  edit(): void {
    if (this.form.valid) {
      // this.loading = true;
      const data = {
        ...this.form.value,
        date_naissance: this.formValue('date_naissance').year
          ? `${this.formValue('date_naissance').year}/${
              this.formValue('date_naissance').month
            }/${this.formValue('date_naissance').day}`
          : this.formValue('date_naissance'),
      };
      this.fillFormData(data);

      this.edited.emit(this.formData);

      // this.usersService.update(this.user.id, this.formData).subscribe(() => {
      //   this.loading = false;
      //   this.edited.emit();
      // this.formData = new FormData();
      // this.helper.notification.toastSuccess(
      //   "Un mail de confirmation a été envoyé à l'utilisateur"
      // );
      // });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }
}
