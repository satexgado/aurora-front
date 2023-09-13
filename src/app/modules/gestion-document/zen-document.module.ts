import { SidebarDocumentComponent } from './sidebar-document/sidebar-document.component';
import { GedStructureComponent } from './structure-ui/structure-ui.component';
import { ZenPartageUiComponent } from './partage-ui/partage-ui.component';
import { ZenFichierListUiComponent } from './fichier-list-ui/fichier-list-ui.component';
import { ZenMesPartageUiComponent } from './mes-partage-ui/mes-partage-ui.component';
import { ZenDossierListUiComponent } from './dossier-list-ui/dossier-list-ui.component';
import { DossierItemUiComponent } from './dossier-item-ui/dossier-item-ui.component';
import { FichierItemUiComponent } from './fichier-item-ui/fichier-item-ui.component';
import { ZenDossierUiComponent } from './dossier-ui/dossier-ui.component';
import { SidebarComponent } from './fichier-side/sidebar.component';
import { SidebarDetailsUiComponent } from './sidebar-details-ui/sidebar-details-ui.component';
import { SidebarDetailsFichierUiComponent } from './sidebar-details-ui/fichier-ui/sidebar-details-fichier-ui.component';
import { SidebarDetailsDossierUiComponent } from './sidebar-details-ui/dossier-ui/sidebar-details-dossier-ui.component';
import { ZenFichierModule } from './fichier/fichier.module';
import { ZenDocumentHomeComponent } from './home/home.component';
import { ZenDossierFichierModule } from './dossier/dossier.module';
import { ZenDocumentTemplateComponent } from './template/template.component';
import { ZenDocumentRoutingModule } from './zen-document-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownSelectModule } from 'src/app/dropdown-select/dropdown-select.module';
import { UploadModule } from 'src/app/upload';
import { SharedZenDocumentModule } from './zen-document-share/shared.module';
import { ZenMesFavorisUiComponent } from './favoris-ui/favoris-ui.component'
import { NotificationModule } from 'src/app/shared';
import { ZenDocumentTypeUiComponent } from './type-ui/type-ui.component'
import { DossierItemCardUiComponent } from './dossier-item-card-ui/dossier-item-card-ui.component';
import { FichierItemCardUiComponent } from './fichier-item-card-ui/fichier-item-card-ui.component';
import { GedDossierAdministratifUiComponent } from './dossier-administratif-ui/dossier-administratif-ui.component';
import { GedDossierAdministratifEditComponent } from './dossier-administratif-ui/edit/edit.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    ZenDocumentTemplateComponent,
    ZenDocumentHomeComponent,
    SidebarDetailsDossierUiComponent,
    SidebarDetailsFichierUiComponent,
    SidebarDetailsUiComponent,
    SidebarComponent,
    ZenDossierUiComponent,
    FichierItemUiComponent,
    DossierItemUiComponent,
    ZenDossierListUiComponent,
    ZenMesPartageUiComponent,
    ZenPartageUiComponent,
    ZenFichierListUiComponent,
    ZenMesFavorisUiComponent,
    GedStructureComponent,
    SidebarDocumentComponent,
    ZenDocumentTypeUiComponent,
    DossierItemCardUiComponent,
    FichierItemCardUiComponent,
    GedDossierAdministratifUiComponent,
    GedDossierAdministratifEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModalModule,
    DropdownSelectModule,
    UploadModule,
    ZenDocumentRoutingModule,
    ZenDossierFichierModule,
    ZenFichierModule,
    SharedZenDocumentModule,
    AngularMultiSelectModule
  ],
  exports: [
    FichierItemUiComponent,
    DossierItemUiComponent,
  ],
  entryComponents: [
    GedDossierAdministratifEditComponent
  ]
})
export class ZenDocumentModule {

}
