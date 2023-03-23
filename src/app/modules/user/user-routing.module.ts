import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { AuthorisationGuardService } from 'src/app/shared/guard/authorisation.guard';
import { UserDetailsComponent } from './details/user-details.component';
import { UserDetailsResolver } from './details/user-details.resolver';
import { UserDetailsHomeComponent } from './details/home/ud-home.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    data: {
      // guards: [{
      //   scope: 'annuaire',
      //   access: 'LECTURE'
      // }]
    },
    canActivate: [AuthorisationGuardService]
  },
  {
    path:':id',
    component: UserDetailsComponent,
    data: {
      guards: [{
        scope: 'annuaire',
        access: 'LECTURE'
      }]
    },
    resolve: { user: UserDetailsResolver},
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', component: UserDetailsHomeComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [UserDetailsResolver]
})
export class UserRoutingModule {}
