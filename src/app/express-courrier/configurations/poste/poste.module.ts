import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosteComponent } from './poste.component';
import { RouterModule, Routes } from '@angular/router';
import { PosteCreateComponent } from './poste-create/poste-create.component';
import { PosteEditComponent } from './poste-edit/poste-edit.component';
import { PosteListComponent } from './poste-list/poste-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonElementModule } from './../../../shared/common-element/common-element.module';
import { PosteShowComponent } from './poste-show/poste-show.component';

const routes: Routes = [
  {
    path: '',
    component: PosteComponent,
    children: [
      {
        path: ':id',
        component: PosteShowComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    PosteComponent,
    PosteCreateComponent,
    PosteEditComponent,
    PosteListComponent,
    PosteShowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CommonElementModule,
  ],
  exports: [RouterModule],
})
export class PosteModule {}
