import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebardashComponent } from './sidebardash/sidebardash.component';
import { AccueildashComponent } from './accueildash/accueildash.component';
import { RouterModule, Routes } from '@angular/router';
import { ShareddashModule } from '../shareddash/shareddash.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SidebabarvueunComponent } from './vueun/sidebabarvueun/sidebabarvueun.component';
import { BasevueunComponent } from './vueun/basevueun/basevueun.component';
import { CourrierentrantComponent } from './vueun/courrierentrant/courrierentrant.component';
import { CourriersortiComponent } from './vueun/courriersorti/courriersorti.component';
import { CourrierinterneComponent } from './vueun/courrierinterne/courrierinterne.component';
import { VuedeuxComponent } from './vuedeux/vuedeux.component';
import { VuetroisComponent } from './vuetrois/vuetrois.component';
import { VuequatreComponent } from './vuequatre/vuequatre.component';

const appRoute: Routes = [
  {path:'',component:SidebardashComponent,
    children:[
      {path:'', pathMatch:'full', component:AccueildashComponent},
      {path:'accueil', component:AccueildashComponent},
      {path:'vueun', component:SidebabarvueunComponent,
         children:[
           {path:'courrierentrant',component:CourrierentrantComponent},
           {path:'courriersorti',component:CourriersortiComponent},
           {path:'courrierinterne',component:CourrierinterneComponent}
         ]
      },
      {path:'vuedeux',component:VuedeuxComponent},
      {path:'vuetrois',component:VuetroisComponent},
      {path:'vuequatre',component:VuequatreComponent}
    ]
  },
];


@NgModule({
  declarations: [
    SidebardashComponent,
    AccueildashComponent,
    SidebabarvueunComponent,
    BasevueunComponent,
    CourrierentrantComponent,
    CourriersortiComponent,
    CourrierinterneComponent,
    VuedeuxComponent,
    VuetroisComponent,
    VuequatreComponent
  ],
  imports: [
    CommonModule,
    ShareddashModule,
    NgApexchartsModule,
    RouterModule.forChild(appRoute)
  ]
})
export class DashboardModule { }
