import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { SharedModule } from '../shared/shared.module';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { UserShowComponent } from './user-show/user-show.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserPasswordEditComponent } from './user-password-edit/user-password-edit.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UsersCreateComponent,
    UsersEditComponent,
    UserShowComponent,
    UserEditComponent,
    UserPasswordEditComponent,
  ],
  imports: [CommonModule, SharedModule, NgbDatepickerModule, NgxPicaModule, NgbModule, RouterModule],
  exports: [UsersCreateComponent, UsersEditComponent],
})
export class UsersModule {}
