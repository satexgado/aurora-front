import { MasqueModuleUtilisateurResolver } from './masque-module-utilisateur.resolver';
import { RolePermissionTemplateComponent } from './template/template.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleUtilisateurTabsUiComponent } from './module-utilisateur-tabs-ui/module-utilisateur-tabs-ui.component';

const routes: Routes = [
  { path: '', component: RolePermissionTemplateComponent, children: [
    {path: '', component: ModuleUtilisateurTabsUiComponent, resolve: { masques: MasqueModuleUtilisateurResolver}}
  ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [MasqueModuleUtilisateurResolver]
})
export class RolePermissionRoutingModule {}
