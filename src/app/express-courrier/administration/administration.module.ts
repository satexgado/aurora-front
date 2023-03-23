import { ServiceDefaultComponent } from './../../modules/gestion-courrier/service-default/service-default.component';
import { DomaineModule } from './../../modules/gestion-courrier/domaine/domaine.module';
import { DomaineComponent } from './../../modules/gestion-courrier/domaine/domaine.component';
import { ComposanteComponent } from './composante/composante.component';
import { HierarchieComponent } from './hierarchie/hierarchie.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { ProprieteComponent } from './propriete/propriete.component';
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
import { NatureModule } from 'src/app/modules/gestion-courrier/nature/nature.module';
import { UrgenceModule } from 'src/app/modules/gestion-courrier/urgence/urgence.module';
import { StatutModule } from 'src/app/modules/gestion-courrier/statut/statut.module';
import { TypeModule } from 'src/app/modules/gestion-courrier/type/type.module';
import { NatureComponent } from 'src/app/modules/gestion-courrier/nature/nature.component';
import { TypeComponent } from 'src/app/modules/gestion-courrier/type/type.component';
import { EtapeComponent } from 'src/app/modules/gestion-courrier/etape/etape.component';
import { StatutComponent } from 'src/app/modules/gestion-courrier/statut/statut.component';
import { UrgenceComponent } from 'src/app/modules/gestion-courrier/urgence/urgence.component';
import { ServiceDefaultModule } from 'src/app/modules/gestion-courrier/service-default/service-default.module';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'compte'
      },
      {
        path:'compte',
        component: CompteComponent,
        children: [
          {
            path: '',
            component: UserShowComponent,
            pathMatch: 'full'
          },
          {
            path: 'facture',
            component: UserShowComponent,
          },
          {
            path: 'module',
            component: UserShowComponent,
          }
        ]
      },
      {
        path:'propriete',
        component: ProprieteComponent,
        children: [
          {
            path: '',
            redirectTo: 'nature',
            pathMatch: 'full'
          },
          {
            path: 'nature',
            component: NatureComponent
          },
          {
            path: 'type',
            component: TypeComponent
          },
          {
            path: 'etape',
            component: EtapeComponent
          },
          {
            path: 'statut',
            component: StatutComponent
          },
          {
            path: 'urgence',
            component: UrgenceComponent
          },
          {
            path: 'domaine',
            component: DomaineComponent
          },
          {
            path: 'service',
            component: ServiceDefaultComponent
          }
        ]
      },
      {
        path:'composante',
        component: ComposanteComponent,
        children: [
          {
            path: '',
            redirectTo: 'service',
            pathMatch: 'full'
          },
          {
            path: 'service',
            loadChildren: () =>
            import('../structure/structure/structure.module').then(
              (module) => module.StructureModule
            ),
          },
          {
            path: 'dossier',
          },
          {
            path: 'modele',
          },
          {
            path: 'signature',
          },
          {
            path: 'coffre',
          }
        ]
      },
      {
        path:'utilisateur',
        component: UtilisateurComponent,
        children: [
          {
            path: '',
            redirectTo: 'liste',
            pathMatch: 'full'
          },
          {
            path: 'liste',
            loadChildren: () =>
            import('./utilisateur/employe/employe.module').then(
              (module) => module.EmployeModule
            )
          },
          {
            path: 'role',
            loadChildren: () =>
            import('../roles/roles.module').then((m) => m.RolesModule),
          },
          {
            path: 'poste',
            loadChildren: () =>
              import(
                '../configurations/poste/poste.module'
              ).then((module) => module.PosteModule),
          },
          {
            path: 'fonction',
            loadChildren: () =>
            import('../configurations/fonction/fonction.module').then(
              (module) => module.FonctionModule
            ),
          }
        ]
      },
    ],
  },
];

@NgModule({
  declarations: [
    AdministrationComponent,
    CompteComponent,
    ProprieteComponent,
    UtilisateurComponent,
    HierarchieComponent,
    ComposanteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedModule2,
    NgbNavModule,
    RouterModule.forChild(routes),
    NatureModule,
    UrgenceModule,
    StatutModule,
    TypeModule,
    UsersModule,
    DomaineModule,
    ServiceDefaultModule
    // MatTabsModule,
  ],
  providers: [SlugifyPipe],
  exports: [RouterModule],
})
export class AdministrationModule {}
