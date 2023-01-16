import { DossierModule } from './dossier/dossier.module';
import { CourrierUiModule } from './courrier/courrier-ui.module';
import { SidebarCourrierComponent } from './sidebar-courrier/sidebar-courrier.component';
import { CourrierSortantModule } from './courrier-sortant/courrier-sortant.module';
import { JsonFormModule } from './json-form/json-form.module';
import { StatutModule } from './statut/statut.module';
import { NatureModule } from './nature/nature.module';
import { UrgenceModule } from './urgence/urgence.module';
import { CourrierEntrantModule } from './courrier-entrant/courrier-entrant.module';
import { MoyenSuiviModule } from './moyen-suivi/moyen-suivi.module';
import { TypeModule } from './type/type.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownSelectModule } from 'src/app/dropdown-select/dropdown-select.module';
import { UploadModule } from 'src/app/upload';
import { GestionCourrierRoutingModule } from './gestion-courrier-routing.module';
import { AnalyseCourrierModule } from './courrier/analyse2/analyse2.module';

@NgModule({
  declarations: [
    SidebarCourrierComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModalModule,
    DropdownSelectModule,
    UploadModule,
    GestionCourrierRoutingModule,
    MoyenSuiviModule,
    CourrierEntrantModule,
    CourrierSortantModule,
    NatureModule,
    UrgenceModule,
    StatutModule,
    TypeModule,
    JsonFormModule,
    CourrierUiModule,
    DossierModule,
    AnalyseCourrierModule
  ],
  exports: [
  ],
  entryComponents: [
  ]
})
export class GestionCourrierModule {

}
