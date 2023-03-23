import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidelabcolabComponent } from './sidelabcolab/sidelabcolab.component';
import { SidefichierComponent } from './fichier/sidefichier/sidefichier.component';
import { ShareddashModule } from '../shareddash/shareddash.module';
import { RouterModule, Routes } from '@angular/router';
import { BasecolobsComponent } from './fichier/basecolobs/basecolobs.component';
import { SidexfileComponent } from './xfile/sidexfile/sidexfile.component';
import { SidemodellabComponent } from './model/sidemodellab/sidemodellab.component';
import { ServicefichierComponent } from './fichier/servicefichier/servicefichier.component';
import { MotclefichierComponent } from './fichier/motclefichier/motclefichier.component';
import { EcheancefichierComponent } from './fichier/echeancefichier/echeancefichier.component';
import { VuearbreComponent } from './fichier/vuearbre/vuearbre.component';
import { VuekanbanComponent } from './fichier/vuekanban/vuekanban.component';
import { MysidefichierComponent } from './fichier/mysidefichier/mysidefichier.component';


const appRoute: Routes = [
  {path:'',component:SidelabcolabComponent,
   children:[
    {path: '', redirectTo: 'fichier', pathMatch: 'full'},
    {path:'xfile',component:MysidefichierComponent,
        children:[
          {path:'',component:SidefichierComponent},
          {path:'vue_arbre/:id',component:VuearbreComponent},
          {path:'vue_kanban',component:VuekanbanComponent}
        ]
    },
    {path:'fichier',component:SidexfileComponent},
    {path:'modele',component:SidemodellabComponent}
   ]
  }
];

@NgModule({
  declarations: [
    SidelabcolabComponent,
    SidefichierComponent,
    BasecolobsComponent,
    SidexfileComponent,
    SidemodellabComponent,
    ServicefichierComponent,
    MotclefichierComponent,
    EcheancefichierComponent,
    VuearbreComponent,
    VuekanbanComponent,
    MysidefichierComponent
  ],
  imports: [
    CommonModule,
    ShareddashModule,
    RouterModule.forChild(appRoute)
  ]
})
export class LabcolabModule { }
