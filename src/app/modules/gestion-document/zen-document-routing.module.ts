import { ZenStructureResolver } from './structure-ui/structure-ui.resolver';
import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { ZenDossierResolver } from './dossier-ui/dossier-resolver';
import { ZenDocumentHomeComponent } from './home/home.component';
import { ZenDocumentTemplateComponent } from './template/template.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZenDossierUiComponent } from './dossier-ui/dossier-ui.component';
import { ZenMesPartageUiComponent } from './mes-partage-ui/mes-partage-ui.component';
import { ZenPartageUiComponent } from './partage-ui/partage-ui.component';
import { ZenMesFavorisUiComponent } from './favoris-ui/favoris-ui.component';
import { GedStructureComponent } from './structure-ui/structure-ui.component';
import { SidebarDocumentComponent } from './sidebar-document/sidebar-document.component';
import { ZenDocumentTypeUiComponent } from './type-ui/type-ui.component';
import { ZenDocumentTypeUiResolver } from './type-ui/type-ui.resolver';
import { AuthorisationGuardService } from 'src/app/shared/guard/authorisation.guard';


const routes: Routes = [
    { path: '', component: ZenDocumentTemplateComponent, 
    data: {
      guards: [{
        scope: 'fichier',
        access: 'LECTURE'
      }]
    },
    canActivate: [AuthorisationGuardService],
    children: [
      {path:'', pathMatch:'full',
        // component: ZenDocumentHomeComponent
        redirectTo: 'mon-espace'
      },
      {path:'type/:id', component: ZenDocumentTypeUiComponent,
      resolve: { type: ZenDocumentTypeUiResolver}},
      {path:'mes-partages', component: ZenMesPartageUiComponent},
      {path:'partage', component: ZenPartageUiComponent},
      {path:'favoris', component: ZenMesFavorisUiComponent},
      {path:'mon-espace', component: ZenDossierUiComponent},
      {path:'structure', component: GedStructureComponent, resolve: { data: ZenStructureResolver}},
      {path:'structure/:id', component: GedStructureComponent,
      resolve: { data: ZenStructureResolver},
      children: [
        {path: '', pathMatch: 'full', redirectTo:'dossier'},
        {
          path:'dossier', component: ZenDossierUiComponent,
          data: {
            folder_parent: 'structures'
          },
        },
        {
          data: {
            folder_parent: 'structures'
          },
          path:'dossier/:id', component: ZenDossierUiComponent,
          resolve: { dossier: ZenDossierResolver}
        }
      ]},
      {
        data: {
          additionnal_filter:
          {or: false, filters: [
            new Filter('linkedToUser', true, 'eq')
          ]}
        },
        path:'mon-espace/:id', component: ZenDossierUiComponent,
        resolve: { dossier: ZenDossierResolver}
      }
    ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [ZenDossierResolver, ZenStructureResolver, ZenDocumentTypeUiResolver]
})
export class ZenDocumentRoutingModule {}
