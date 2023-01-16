import { MarcheAnalyseComponent } from './analyse/analyse.component';
import { TableauFournisseurComponent } from './tableau-fournisseur/tableau-fournisseur.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarcheComponent } from './marche/marche.component';
import { TableauPartenaireComponent } from './table-partenaire/tableau-partenaire.component';
import { MarchePublicTemplateComponent } from './template/template-ui.component';
import { MarcheTypeComponent } from './type-marche/marche-type.component';
import { ProcedureTypeHomeComponent } from './type-procedure/home/procedure-type-home.component';
import { DashboardComponent } from './analyse2/dashboard/dashboard.component';
import { AuthorisationGuardService } from 'src/app/shared/guard/authorisation.guard';


const routes: Routes = [
    { path: '', component: MarchePublicTemplateComponent,
    data: {
      guards: [{
        scope: 'marche public',
        access: 'LECTURE'
      }]
    },
    canActivate: [AuthorisationGuardService],
    children: [
      {path:'', pathMatch: 'full', redirectTo:'marche'},
      {path:'type-marche', component: MarcheTypeComponent},
      {path:'procedure', component: ProcedureTypeHomeComponent},
      {path:'marche', component: MarcheComponent},
      {path:'tableau-fournisseur', component: TableauFournisseurComponent},
      // {path:'analyse', component: MarcheAnalyseComponent},
      {path:'analyse', component: DashboardComponent},
      {path:'tableau-partenaire', component: TableauPartenaireComponent}
    ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class MarchePublicRoutingModule {}
