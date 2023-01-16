import { Analyse2Module } from './analyse2/analyse2.module';
import { ChartComponent } from './analyse2/dashboard/chart/chart.component';
import { MarcheAnalyseComponent } from './analyse/analyse.component';
import { TableauFournisseurComponent } from './tableau-fournisseur/tableau-fournisseur.component';
import { TableauPartenaireComponent } from './table-partenaire/tableau-partenaire.component';
import { MarcheModule } from './marche/marche.module';
import { ProcedureTypeModule } from './type-procedure/procedure-type.module';
import { MarchePublicRoutingModule } from './marche-public-routing.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownSelectModule } from 'src/app/dropdown-select/dropdown-select.module';
import { UploadModule } from 'src/app/upload';
import { MarcheTypeModule } from './type-marche/marche-type.module';
import { EtapeModule } from './etape/etape.module'
import { MarchePublicTemplateComponent } from './template/template-ui.component';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
  declarations: [
    MarchePublicTemplateComponent,
    TableauPartenaireComponent,
    TableauFournisseurComponent,
    MarcheAnalyseComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModalModule,
    DropdownSelectModule,
    UploadModule,
    MarcheTypeModule,
    EtapeModule,
    ProcedureTypeModule,
    MarcheModule,
    MarchePublicRoutingModule,
    NgApexchartsModule,
    Analyse2Module
  ],
  exports: [
  ],
  entryComponents: [
  ]
})
export class MarchePublicModule {

}
