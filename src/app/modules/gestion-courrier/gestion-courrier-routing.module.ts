import { DossierComponent } from './dossier/dossier.component';
import { JsonFormControlListComponent } from './json-form/list/json-form-list.component';
import { CourrierEntrantDetailsResolver } from './courrier-entrant/details/courrier-entrant-details.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourrierSortantDetailsResolver } from './courrier-sortant/details/courrier-sortant-details.resolver';
import { CourrierUiComponent } from './courrier/courrier-ui.component';
import { CourrierEntrantUiComponent } from './courrier/entrant-ui/entrant-ui.component';
import { CourrierSortantUiComponent } from './courrier/sortant-ui/sortant-ui.component';
import { CourrierDossierUiComponent } from './courrier/dossier-ui/dossier-ui.component';
import { CourrierUiHomeComponent } from './courrier/home/home.component';
import { CourrierUiProprieteComponent } from './courrier/propriete-ui/propriete-ui.component';
import { AnalyseCourrierUiComponent } from './courrier/analyse-ui/analyse-ui.component';
import { CourrierEntrantUiResolver } from './courrier/entrant-ui/entrant-ui.resolver';
import { CourrierSortantUiResolver } from './courrier/sortant-ui/sortant-ui.resolver';
import { AuthorisationGuardService } from 'src/app/shared/guard/authorisation.guard';
import { DossierUiResolver } from './courrier/dossier-ui/dossier-ui.resolver';
import { ReaffectationUiComponent } from './courrier/reaffectation-ui/reaffectation-ui.component';

const routes: Routes = [
    { path: '', component: CourrierUiComponent,
    data: {
      guards: [{
        scope: 'courrier entrant',
        access: 'LECTURE'
      },
      {
        scope: 'courrier sortant',
        access: 'LECTURE'
      },
      {
        scope: 'proprietes courrier',
        access: 'LECTURE'
      },
      {
        scope: 'suivis',
        access: 'LECTURE'
      },
      {
        scope: 'dashboard',
        access: 'LECTURE'
      }]
    },
    canActivate: [AuthorisationGuardService],
    children: [
      {path:'', pathMatch: 'full', redirectTo:'acceuil'},
      {
        path: 'suivi',
        loadChildren: () =>
          import('../../suivi/suivi.module').then(
            (module) => module.SuiviModule
          ),
      },
      {
        path: 'rapport',
        loadChildren: () =>
          import('../../rapport/rapport.module').then(
            (module) => module.RapportModule
          ),
      },
      {path:'acceuil', component: CourrierUiHomeComponent},
      {path:'affectation', component: ReaffectationUiComponent},
      {
        path:'entrant',
        component: CourrierEntrantUiComponent,
        canActivate: [AuthorisationGuardService],
        data: {
            guards: [{
              scope: 'courrier entrant',
              access: 'LECTURE'
            }],
            externe: 1
        },
        children: [
          {
            path: ':id',
            resolve: { courrier: CourrierEntrantUiResolver}
          }
        ]
      },
      {
        path:'interne',
        component: CourrierEntrantUiComponent,
        canActivate: [AuthorisationGuardService],
        data: {
            guards: [{
              scope: 'courrier entrant',
              access: 'LECTURE'
            }],
            externe: 0
        },
        children: [
          {
            path: ':id',
            resolve: { courrier: CourrierEntrantUiResolver}
          }
        ]
      },
      {
        path:'sortant',
        component: CourrierSortantUiComponent,
        canActivate: [AuthorisationGuardService],
        data: {
            guards: [{
              scope: 'courrier sortant',
              access: 'LECTURE'
          }]
        },
        children: [
          {
            path: ':id',
            resolve: { courrier: CourrierSortantUiResolver}
          }
        ]
      },
      {
        path:'propriete',
        component: CourrierUiProprieteComponent,
        canActivate: [AuthorisationGuardService],
        data: {
            guards: [{
              scope: 'proprietes courrier',
              access: 'LECTURE'
          }]
        },
      },
      {
        path:'dossier', component: CourrierDossierUiComponent,
        children: [
          {
            path: ':id',
            resolve: { dossier: DossierUiResolver}
          }
        ]
      },
      // {path:'form', component: JsonFormControlListComponent},
      // {path:'analyse', component: DashboardComponent},
      {path:'analyse', component: AnalyseCourrierUiComponent}
    ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [CourrierEntrantDetailsResolver, CourrierSortantDetailsResolver, CourrierEntrantUiResolver, CourrierSortantUiResolver, DossierUiResolver]
})
export class GestionCourrierRoutingModule {}
