import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionnaireTacheComponent } from './tache.component';


const routes: Routes = [
  {
    path: '',
    component: GestionnaireTacheComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class GestionnaireTacheRoutingModule {}
