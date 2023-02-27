import { CourrierSharedModule } from './../modules/gestion-courrier/courrier-shared/courrier-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidesuiviComponent } from './sidesuivi/sidesuivi.component';
import { RouterModule, Routes } from '@angular/router';
import { ShareddashModule } from '../shareddash/shareddash.module';
import { ExecutionComponent } from './execution/execution.component';
const appRoute: Routes = [
  {path:'',component:SidesuiviComponent,
   children:[
    {path:':id',component:ExecutionComponent}
   ]
  }
];


@NgModule({
  declarations: [
    SidesuiviComponent,
    ExecutionComponent
  ],
  imports: [
    CommonModule,
    ShareddashModule,
    RouterModule.forChild(appRoute),
    CourrierSharedModule
  ]
})
export class SuiviModule { }
