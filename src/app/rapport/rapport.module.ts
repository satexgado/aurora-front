import { CourrierSharedModule } from './../modules/gestion-courrier/courrier-shared/courrier-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiderapportComponent } from './siderapport/siderapport.component';
import { ExecrapportComponent } from './execrapport/execrapport.component';
import { ShareddashModule } from '../shareddash/shareddash.module';
import { RouterModule, Routes } from '@angular/router';

const appRoute: Routes = [
  {path:'',component:SiderapportComponent,
   children:[
    {path:':id',component:ExecrapportComponent}
   ]
  }
];

@NgModule({
  declarations: [
    SiderapportComponent,
    ExecrapportComponent
  ],
  imports: [
    CommonModule,
    ShareddashModule,
    RouterModule.forChild(appRoute),
    CourrierSharedModule
  ]
})
export class RapportModule { }
