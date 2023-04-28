import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProprieteGedComponent } from './propriete-ged.component';
import { ModeleComponent } from './modele/modele.component';

const routes: Routes = [
  {
    path: '',
    component: ProprieteGedComponent,
    children: [
      {path:'', pathMatch: 'full', redirectTo: 'modele'},
      {
        path: 'modele', component: ModeleComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class ProprieteGedRoutingModule {}
