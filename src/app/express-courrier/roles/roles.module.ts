import { EmployeModule } from './../administration/utilisateur/employe/employe.module';
import { AutorisationsShowComponent } from './autorisations/autorisations-show/autorisations-show.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { RolesCreateComponent } from './roles-create/roles-create.component';
import { AutorisationsCreateComponent } from './autorisations/autorisations-create/autorisations-create.component';
import { RolesShowComponent } from './roles-show/roles-show.component';
import { RolesUsersComponent } from './roles-users/roles-users.component';
import { SlugifyPipe } from './../../shared/pipes/slugify.pipe';
import { NgbNavModule, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as SharedModule2 } from 'src/app/shared/shared.module';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { EmployeShowComponent } from '../administration/utilisateur/employe/employe-show/employe-show.component';

const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
    children: [
      {
        path: ':id',
        component: RolesShowComponent,

      },
    ],
  },
];

@NgModule({
  declarations: [
    RolesComponent,
    RolesListComponent,
    RolesCreateComponent,
    AutorisationsCreateComponent,
    RolesShowComponent,
    AutorisationsShowComponent,
    RolesUsersComponent,
    RolesEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedModule2,
    NgbNavModule,
    RouterModule.forChild(routes),
    // MatTabsModule,
  ],
  providers: [SlugifyPipe],
  exports: [RouterModule],
})
export class RolesModule {}
