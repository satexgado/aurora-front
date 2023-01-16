import { AnalyseCourrierUiComponent } from './analyse-ui/analyse-ui.component';
import { AnalyseCourrierEntrantModule } from './../courrier-entrant/analyse-entrant/analyse2.module';
import { AnalyseCourrierSortantModule } from './../courrier-sortant/analyse-sortant/analyse2.module';
import { CourrierEntrantUiComponent } from './entrant-ui/entrant-ui.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CourrierEntrantModule } from '../courrier-entrant/courrier-entrant.module';
import { CourrierSortantModule } from '../courrier-sortant/courrier-sortant.module';
import { CourrierUiComponent } from './courrier-ui.component';
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';
import { StructureModule } from 'src/app/express-courrier/structure/structure/structure.module'
import { CourrierSortantUiComponent } from './sortant-ui/sortant-ui.component';
import { CourrierUiHomeComponent } from './home/home.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CourrierUiProprieteComponent } from './propriete-ui/propriete-ui.component';
import { EtapeModule } from '../etape/etape.module';
import { NatureModule } from '../nature/nature.module';
import { UrgenceModule } from '../urgence/urgence.module';
import { StatutModule } from '../statut/statut.module';
import { TypeModule } from '../type/type.module';

@NgModule({
    declarations: [
      CourrierUiComponent,
      CourrierEntrantUiComponent,
      CourrierSortantUiComponent,
      CourrierUiHomeComponent,
      CourrierUiProprieteComponent,
      AnalyseCourrierUiComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        DragDropModule,
        CustomInputModule,
        AngularMultiSelectModule,
        CourrierEntrantModule,
        CourrierSortantModule,
        ModalSidebarAltModule,
        StructureModule,
        NgApexchartsModule,
        NatureModule,
        UrgenceModule,
        StatutModule,
        TypeModule,
        EtapeModule,
        AnalyseCourrierEntrantModule,
        AnalyseCourrierSortantModule
    ],
    entryComponents: [],
})
export class CourrierUiModule {

}
