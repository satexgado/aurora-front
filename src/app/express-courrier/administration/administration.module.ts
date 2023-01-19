import { CompteComponent } from './compte/compte.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlugifyPipe } from './../../shared/pipes/slugify.pipe';
import { NgbNavModule, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as SharedModule2 } from 'src/app/shared/shared.module';
import { AdministrationComponent } from './administration.component';
import { UsersModule } from '../users/users.module';
import { UserShowComponent } from '../users/user-show/user-show.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path:'compte',
        component: CompteComponent,
        children: [
          {
            path: 'utilisateur',
            component: UserShowComponent
          }
        ]
      }
    ],
  },
];

@NgModule({
  declarations: [
    AdministrationComponent,
    CompteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedModule2,
    NgbNavModule,
    RouterModule.forChild(routes),
    UsersModule
    // MatTabsModule,
  ],
  providers: [SlugifyPipe],
  exports: [RouterModule],
})
export class AdministrationModule {}
