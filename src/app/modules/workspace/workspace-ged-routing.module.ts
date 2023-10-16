import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { GedWorkspaceResolver } from './workspace.resolver'
import { GedWorkspaceUiComponent } from './workspace-ui/workspace-ui.component';
const routes: Routes = [
  {
    path: '',
    component: WorkspaceListComponent
  },
  {
    path: ':id',
    component: GedWorkspaceUiComponent,
    resolve: { workspace: GedWorkspaceResolver}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [GedWorkspaceResolver]
})
export class WorkspaceGedRoutingModule {}
