import { SidebarStructureComponent } from './sidebar-structure/sidebar-structure.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureComponent } from './structure.component';
import { RouterModule, Routes } from '@angular/router';
import { TreeModule } from '../../tree/tree.module';
import { StructureTreeComponent } from './structure-tree/structure-tree.component';
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';
import { DragScrollModule } from 'ngx-drag-scroll';
import { StructurePreviewComponent } from './structure-preview/structure-preview.component';
import { SharedModule } from '../../shared/shared.module';
import { StructureSharedModule } from './structure-shared/structure-shared.module';
import { StructureTreeSoloComponent } from './structure-tree/structure-tree-solo/structure-tree-solo.component';
import { StructureOrganigrammeComponent } from './structure-organigramme/structure-organigramme.component';
import { StructureListComponent } from './structure-list/structure-list.component';
import { StructureAutresLieesComponent } from './structure-autres-liees/structure-autres-liees.component';

const routes: Routes = [
  {
    path: '',
    component: StructureComponent,
    children: [
      {
        path: '',
        component: StructureListComponent,
      },
      {
        path: 'organigramme',
        component: StructureOrganigrammeComponent,
      },
      {
        path: 'all',
        component: StructureAutresLieesComponent,
      },
    ],
  },
  {
    path: 'show',
    loadChildren: () =>
      import('./structure-show/structure-show.module').then(
        (module) => module.StructureShowModule
      ),
  },
];

@NgModule({
  declarations: [
    StructureComponent,
    StructureTreeComponent,
    StructurePreviewComponent,
    StructureTreeSoloComponent,
    StructureOrganigrammeComponent,
    StructureListComponent,
    StructureAutresLieesComponent,
    SidebarStructureComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TreeModule,
    StructureSharedModule,
    ModalSidebarAltModule,
    DragScrollModule,
    SharedModule,
  ],
  exports: [RouterModule, StructurePreviewComponent],
})
export class StructureModule {}
