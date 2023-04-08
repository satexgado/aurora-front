import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StructureComponent } from './structure.component';
import { StructureUiResolver } from './structure-ui.resolver'

const routes: Routes = [
    { 
      path: '', 
      component: StructureComponent,
      children: [
        {
          path: ':id',
          resolve: { structure: StructureUiResolver}
        }
      ]
    },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [
    StructureUiResolver
  ]
})
export class StructureRoutingModule {}
