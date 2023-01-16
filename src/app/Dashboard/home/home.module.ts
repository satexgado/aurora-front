import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { ShareddashModule } from '../shareddash/shareddash.module';
import { NgApexchartsModule } from 'ng-apexcharts';


const appRoute: Routes = [
  {path:'',component:HomeComponent},
];
@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ShareddashModule,
    NgApexchartsModule,
    RouterModule.forChild(appRoute)
  ]
})
export class HomeModule { }
