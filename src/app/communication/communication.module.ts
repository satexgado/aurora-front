import { SidebarCommunicationComponent } from './sidebar-communication/sidebar-communication.component';
import { ShareddashModule } from './../shareddash/shareddash.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarcomComponent } from './sidebarcom/sidebarcom.component';
import { EvenementComponent } from './evenement/evenement.component';
import { RouterModule, Routes } from '@angular/router';
import { FileeventComponent } from './evenement/fileevent/fileevent.component';
import { TableauobjectifComponent } from './tableauobjectif/tableauobjectif.component';
import { MurideeComponent } from './muridee/muridee.component';


const appRoute: Routes = [
  {path:'',component:SidebarcomComponent,
    children:[
      {path:'', pathMatch:'full', redirectTo:'evenement', component:EvenementComponent},
      {path:'evenement', component:EvenementComponent},
      {path:'tableauobjectif', component:TableauobjectifComponent},
      {path:'muridee', component:MurideeComponent}
    ]
  },

];


@NgModule({
  declarations: [
    SidebarcomComponent,
    EvenementComponent,
    FileeventComponent,
    TableauobjectifComponent,
    SidebarCommunicationComponent,
    MurideeComponent
  ],
  imports: [
    CommonModule,
    ShareddashModule,
    RouterModule.forChild(appRoute)
  ],
  providers: [
  ],
})
export class CommunicationModule { }
