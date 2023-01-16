import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoordonneeComponent } from './coordonnee.component';
import { CoordonneeDetailsComponent } from './details/coordonnee-details.component';
import { CoodCourrierEntrantComponent } from './details/entrant/cood-centrant.component';
import { CoordonneeDetailsHomeComponent } from './details/home/cood-home.component';
import { CoordonneeDetailsResolver } from './details/coordonnee-details.resolver';
import { CoodCourrierEntrantResolver } from './details/entrant/cood-centrant.resolver';
import { CoodCourrierSortantComponent } from './details/sortant/cood-csortant.component';
import { CoodCourrierSortantResolver } from './details/sortant/cood-csortant.resolver';
import { CoodMarchePublicComponent } from './details/marche-public/cood-marche-public.component';
import { CoodMarchePublicResolver } from './details/marche-public/cood-marche-public.resolver';


const routes: Routes = [
  {
    path: '',
    component: CoordonneeComponent,
  },
  {
    path:':id', 
    component: CoordonneeDetailsComponent,
    resolve: { coordonnee: CoordonneeDetailsResolver},
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', component: CoordonneeDetailsHomeComponent},
      {
        path: 'courrier-entrant',
        component: CoodCourrierEntrantComponent,
        children: [
          {
            path: ':id',
            resolve: { courrier: CoodCourrierEntrantResolver}
          }
        ]
      },
      {
        path: 'courrier-sortant',
        component: CoodCourrierSortantComponent,
        children: [
          {
            path: ':id',
            resolve: { courrier: CoodCourrierSortantResolver}
          }
        ]
      },
      {
        path: 'marche-public',
        component: CoodMarchePublicComponent,
        children: [
          {
            path: ':id',
            resolve: { courrier: CoodMarchePublicResolver}
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [CoordonneeDetailsResolver, CoodCourrierEntrantResolver, CoodCourrierSortantResolver, CoodMarchePublicResolver]
})
export class CoordonneeRoutingModule {}
