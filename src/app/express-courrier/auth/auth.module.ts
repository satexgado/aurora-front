import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SignupWelcomeComponent } from './signup/signup-welcome/signup-welcome.component';
import { SignupUserEditComponent } from './signup/signup-user-edit/signup-user-edit.component';
import { SignupPasswordComponent } from './signup/signup-password/signup-password.component';
import { SignupConditionUtilisationComponent } from './signup/signup-condition-utilisation/signup-condition-utilisation.component';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'inscription',
    component: SignupComponent,
  },
];

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent,
    SignupWelcomeComponent,
    SignupUserEditComponent,
    SignupPasswordComponent,
    SignupConditionUtilisationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    UsersModule,
  ],
  exports: [RouterModule],
})
export class AuthModule {}
