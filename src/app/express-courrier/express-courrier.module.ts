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
import { SharedModule } from '../shared';

const routes: Routes = [
  // {
  //   path: '',
  //   component: HomeComponent
  // },
  {
    path: '',
    component: ExpressCourrierComponent,

    children: [
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
        canLoad: [AuthorisationGuardService],
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
        canLoad: [AuthorisationGuardService],
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

      {
        path: 'service',
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
        path: 'utilisateur',
        loadChildren: () =>
          import('../modules/user/user.module').then(
            (module) => module.UserModule
          ),
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
        canLoad: [AuthorisationGuardService],
        loadChildren: () =>
          import('../modules/gestion-document/zen-document.module').then(
            (m) => m.ZenDocumentModule
          ),
      },
      {
        path: 'config',
        loadChildren: () =>
          import('../modules/propriete-ged/propriete-ged.module').then(
            (module) => module.ProprieteGedModule
          ),
      },
      {
        path: 'workspace',
        loadChildren: () =>
          import('../modules/workspace/workspace-ged.module').then(
            (module) => module.WorkspaceGedModule
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
    NgbModule,
    SharedModule
  ],
  exports: [RouterModule],
})
export class ExpressCourrierModule { }
