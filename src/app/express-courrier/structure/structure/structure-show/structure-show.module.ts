import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/express-courrier/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { StructureShowComponent } from './structure-show.component';
import { StructureDetailsComponent } from './structure-details/structure-details.component';
import { StructureSousStructureComponent } from './structure-sous-structure/structure-sous-structure.component';
import { StructureSharedModule } from '../structure-shared/structure-shared.module';
import { SousStructureSoloComponent } from './sous-structure/sous-structure-solo/sous-structure-solo.component';
import { StructureMessagerieComponent } from './structure-messagerie/structure-messagerie.component';
import { DiscussionModule } from 'src/app/express-courrier/messagerie/discussion/discussion.module';
import { StructureSousStructureListComponent } from './structure-sous-structure/structure-sous-structure-list/structure-sous-structure-list.component';

const routes: Routes = [
  {
    path: ':id',
    component: StructureShowComponent,
    children: [
      {
        path: 'details',
        component: StructureDetailsComponent,
      },
      {
        path: 'sous-structures',
        component: StructureSousStructureComponent,
      },
      {
        path: 'equipe',
        loadChildren: () =>
          import('../../employe/employe.module').then(
            (module) => module.EmployeModule
          ),
      },
      {
        path: 'configurations',
        loadChildren: () =>
          import('../../../configurations/configurations.module').then(
            (module) => module.ConfigurationsModule
          ),
      },
      {
        path: '**',
        redirectTo: 'details',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '..',
  },
];

@NgModule({
  declarations: [
    StructureShowComponent,
    StructureDetailsComponent,
    StructureSousStructureComponent,
    SousStructureSoloComponent,
    StructureMessagerieComponent,
    StructureSousStructureListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DiscussionModule,
    RouterModule.forChild(routes),
    StructureSharedModule,
  ],
  exports: [RouterModule],
})
export class StructureShowModule {}
