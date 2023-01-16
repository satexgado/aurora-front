import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FonctionComponent } from './fonction.component';
import { FonctionCreateComponent } from './fonction-create/fonction-create.component';
import { FonctionEditComponent } from './fonction-edit/fonction-edit.component';
import { FonctionShowComponent } from './fonction-show/fonction-show.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FonctionListComponent } from './fonction-list/fonction-list.component';
import { CommonElementModule } from './../../../shared/common-element/common-element.module';

const routes: Routes = [
  {
    path: '',
    component: FonctionComponent,
    children: [
      {
        path: ':id',
        component: FonctionShowComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    FonctionComponent,
    FonctionCreateComponent,
    FonctionEditComponent,
    FonctionShowComponent,
    FonctionListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    CommonElementModule,
  ],
})
export class FonctionModule {}
