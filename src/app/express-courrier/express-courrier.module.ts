import { HomeComponent } from './home/home2.component';
import { SidebarCourrierComponent } from './sidebar/sidebar-courrier/sidebar-courrier.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { InboxModule } from './inbox/inbox.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './accueil/accueil.component';
import { RouterModule, Routes } from '@angular/router';
import { ExpressCourrierComponent } from './express-courrier.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TunelModule } from './messagerie/tunel/tunel.module';
import { UserShowComponent } from './users/user-show/user-show.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthorisationGuardService } from 'src/app/shared/guard/authorisation.guard'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '',
    component: ExpressCourrierComponent,

    children: [
      // {
      //   path: '',
      //   component: SidebarCourrierComponent,
      //   outlet: 'sidebar',
      // },
      // {
      //   path: '',
      //   loadChildren: () =>
      //     import('../Dashboard/home/home.module').then(
      //       (module) => module.HomeModule
      //     ),
      // },
      {
        path: 'administration',
        loadChildren: () =>
          import('./administration/administration.module').then(
            (module) => module.AdministrationModule
          ),
      },
      {
        path: 'communication',
        loadChildren: () =>
          import('../communication/communication.module').then(
            (module) => module.CommunicationModule
          ),
      },
      {
        path: 'annuaire',
        data: {
          guards: [{
            scope: 'annuaire',
            access: 'LECTURE'
          }]
        },
        canLoad:[AuthorisationGuardService],
        loadChildren: () =>
          import('./coordonnee/coordonnee.module').then(
            (module) => module.CoordonneeModule
          ),
      },
      {
        path: 'groupe-contact',
        data: {
          guards: [{
            scope: 'groupe-contact',
            access: 'LECTURE'
          }]
        },
        canLoad:[AuthorisationGuardService],
        loadChildren: () =>
          import('./coordonnee-groupe/coordonnee-groupe.module').then(
            (module) => module.CoordonneeGroupeModule
          ),
      },
      {
        path: 'tache',
        loadChildren: () =>
          import('../modules/tache/tache.module').then(
            (module) => module.GestionnaireTacheModule
          ),
      },
      {
        path: 'mail',
        loadChildren: () =>
          import('../modules/gestion-mail/gestion-mail.module').then(
            (module) => module.GestionMailModule
          ),
      },
      // {
      //   path: 'dashboard',
      //   loadChildren: () =>
      //     import('../Dashboard/dashboard/dashboard.module').then(
      //       (module) => module.DashboardModule
      //     ),
      // },
      {
        path: 'organisation',
        redirectTo: 'organisation/structures',
      },
      {
        path: 'organisation/structures',
        loadChildren: () =>
          import('./structure/structure/structure.module').then(
            (module) => module.StructureModule
          ),
      },
      {
        path: 'messagerie',
        loadChildren: () =>
          import('./messagerie/messagerie.module').then(
            (module) => module.MessagerieModule
          ),
      },
      {
        path: 'marche-public',
        data: {
          topbar: 'marche',
          guards: [{
            scope: 'marche public',
            access: 'LECTURE'
          }]
        },
        canLoad:[AuthorisationGuardService],
        loadChildren: () =>
          import('../modules/marche-public/marche-public.module').then(
            (module) => module.MarchePublicModule
          )
      },
      {
        path: 'page-not-found',
        component: PageNotFoundComponent,
      },
      {
        path: 'document',
        data: {
          topbar: 'document',
          guards: [{
            scope: 'fichier',
            access: 'LECTURE'
          }]
        },
        canLoad:[AuthorisationGuardService],
        loadChildren: () =>
          import('../modules/gestion-document/zen-document.module').then(
            (m) => m.ZenDocumentModule
          ),
      },
      {
        path: 'courrier',
        data: {
          topbar: 'courrier',
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
        canLoad:[AuthorisationGuardService],
        loadChildren: () =>
          import('../modules/gestion-courrier/gestion-courrier.module').then(
            (m) => m.GestionCourrierModule
          ),
      },
      {
        path: 'users/:id',
        component: UserShowComponent,
      },
      {
        path: '**',
        redirectTo: 'page-not-found',
      },
    ],
  },
];

@NgModule({
  declarations: [ExpressCourrierComponent, AccueilComponent, HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TunelModule,
    NotificationsModule,
    InboxModule,
    SidebarModule,
    NgbModule
  ],
  exports: [RouterModule],
})
export class ExpressCourrierModule {}
