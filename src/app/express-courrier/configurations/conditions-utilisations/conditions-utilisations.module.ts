import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionsUtilisationsComponent } from './conditions-utilisations.component';
import { SharedModule } from './../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ConditionsUtilisationsEditComponent } from './conditions-utilisations-edit/conditions-utilisations-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ConditionsUtilisationsComponent,
  },
];

@NgModule({
  declarations: [ConditionsUtilisationsComponent, ConditionsUtilisationsEditComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConditionsUtilisationsModule {}
