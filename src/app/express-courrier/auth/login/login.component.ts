import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseCreateComponent } from 'src/app/shared/base-component/base-create.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login3.component.html',
  styleUrls: ['./login3.component.css'],
  styles: [`
  .title-header:before {
    border-top: 2px solid #0d47a1!important;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 50%;
}

.title-header h6, .title-header h4 {
    background: #fff;
    color: #0d47a1!important;
    display: inline-block;
    font-weight: 600;
    line-height: 40px;
    margin: 0;
    padding: 0 30px;
    position: relative;
    text-transform: uppercase;
    border: 2px solid #0d47a1!important;
}

/*Card Footer Fixed*/
@supports (box-shadow: 2px 2px 2px black){
  .cart-panel-foo-fix{
    position: sticky;
    bottom: 0;
    z-index: 9;
  }
}
  `]
})
export class LoginComponent extends BaseCreateComponent implements OnInit {
  constructor(public authService: AuthService) {
    super(authService);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  markFormAsInvalid(): void {
    this.form.controls.email.markAsUntouched();

    this.form.controls.password.setErrors({ password: true });

    this.form.controls.password.patchValue('');
  }

  login() {
    this.loading = true;
    //Ajouter par moi
    // this.helper.navigation.navigate(['/']);
    // this.loading = false;
    //Fin

    this.authService.login(this.form.value).subscribe(
      () => {
        this.helper.navigation.navigate(['/']);
        this.loading = false;
      },
      (error) => {
        // if (error.status === 401) {
        this.helper.notification.toastDanger('Donnée de connexion erroné');
        this.markFormAsInvalid();
        this.loading = false;
        // }
      }
    );
  }
}
