import { SharedModule } from './../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationsComponent } from './configurations.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationsComponent,
    children: [
      {
        path: 'roles',
        loadChildren: () =>
          import('../roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'conditions-utilisations',
        loadChildren: () =>
          import(
            './conditions-utilisations/conditions-utilisations.module'
          ).then((module) => module.ConditionsUtilisationsModule),
      },
      {
        path: 'postes',
        loadChildren: () =>
          import('./poste/poste.module').then((module) => module.PosteModule),
      },
      {
        path: 'fonctions',
        loadChildren: () =>
          import('./fonction/fonction.module').then(
            (module) => module.FonctionModule
          ),
      },
      {
        path: '**',
        redirectTo: 'roles',
      },
    ],
  },
];

@NgModule({
  declarations: [ConfigurationsComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationsModule {}
