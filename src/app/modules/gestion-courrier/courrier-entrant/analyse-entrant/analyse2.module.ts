import { CustomSelectIconComponent } from './dashboard/chart/custom-select-icon/custom-select-icon.component';
import { ChoosingComponent } from './dashboard/chart/choosing/choosing.component';
import { ChartComponent } from './dashboard/chart/chart.component';
import { BarComponent } from './dashboard/chart/bar/bar.component';
import { DashboardCourrierEntrantComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartConfigurationComponent } from './dashboard/chart/chart-configuration/chart-configuration.component';
@NgModule({
    declarations: [
      DashboardCourrierEntrantComponent,
      BarComponent,
      ChartComponent,
      ChoosingComponent,
      ChartConfigurationComponent,
      CustomSelectIconComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      InlineEditorModule,
      InfiniteScrollModule,
      AngularMultiSelectModule,
      DragDropModule
    ],
    exports: [
      DashboardCourrierEntrantComponent
    ],
    entryComponents: [],
})
export class AnalyseCourrierEntrantModule {

}
