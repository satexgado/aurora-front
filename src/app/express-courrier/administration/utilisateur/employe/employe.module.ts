import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeComponent } from './employe.component';
import { EmployeListComponent } from './employe-list/employe-list.component';
import { EmployeCreateComponent } from './employe-create/employe-create.component';
import { EmployeEditComponent } from './employe-edit/employe-edit.component';
import { RouterModule, Routes } from '@angular/router';

import { EmployeShowComponent } from './employe-show/employe-show.component';
import { RoleEmployesComponent } from './role-employes/role-employes.component';
import { UsersModule } from 'src/app/express-courrier/users/users.module';
import { SharedModule } from 'src/app/express-courrier/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EmployeComponent,
    children: [
      {
        path: ':id',
        component: EmployeShowComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    EmployeComponent,
    EmployeListComponent,
    EmployeCreateComponent,
    EmployeEditComponent,
    EmployeShowComponent,
    RoleEmployesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    UsersModule,
  ],
  exports: [RouterModule],
})
export class EmployeModule {}
