import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { GedWorkspaceResolver } from './workspace.resolver'
import { GedWorkspaceUiComponent } from './workspace-ui/workspace-ui.component';
import { ZenDossierUiComponent } from '../gestion-document/dossier-ui/dossier-ui.component';
import { GedWorkspaceUserResolver } from './workspace-membres/workspace-membre.resolver';
import { GedWorkspaceCoordonneeResolver } from './workspace-coordonnee/workspace-coordonnee.resolver';
import { ZenDossierResolver } from '../gestion-document/dossier-ui/dossier-resolver';
import { GedWorkspaceDetailsUiResolver } from './workspace-details-ui/workspace-details-ui.resolver';
import { GedWorkspaceDetailsUiComponent } from './workspace-details-ui/workspace-details-ui.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceListComponent
  },
  {
    path: ':id',
    component: GedWorkspaceUiComponent,
    resolve: { workspace: GedWorkspaceResolver },
    children: [
      {
        path: ':id', component: GedWorkspaceDetailsUiComponent,
        resolve: { data: GedWorkspaceDetailsUiResolver },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'bibliotheque' },
          { path: 'produc'},
          { path: 'bibliotheque/dossier', pathMatch: 'full', redirectTo: 'bibliotheque' },
          {
            path: 'bibliotheque', component: ZenDossierUiComponent,
            data: {
              folder_parent: 'coordonnee_linked_workspaces'
            },
          },
          {
            data: {
              folder_parent: 'coordonnee_linked_workspaces'
            },
            path: 'bibliotheque/dossier/:id', component: ZenDossierUiComponent,
            resolve: { dossier: ZenDossierResolver }
          }
        ]
      }

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [GedWorkspaceResolver, GedWorkspaceUserResolver, ZenDossierResolver, GedWorkspaceCoordonneeResolver, GedWorkspaceDetailsUiResolver]
})
export class WorkspaceGedRoutingModule { }
