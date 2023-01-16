import { CourrierSortantDetailsHomeComponent } from './details/ced-home/ced-home.component';
import { CourrierSortantDetailsComponent } from './details/courrier-sortant-details.component';
import { CourrierSortantDetailsResolver } from './details/courrier-sortant-details.resolver';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CourrierSortantComponent } from './courrier-sortant.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CourrierEntrantModule } from '../courrier-entrant/courrier-entrant.module';

@NgModule({
    declarations: [
        CourrierSortantComponent,
        CourrierSortantDetailsComponent,
        CourrierSortantDetailsHomeComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        DragDropModule,
        CustomInputModule,
        AngularMultiSelectModule,
        CourrierEntrantModule
    ],
    entryComponents: [EditComponent],
})
export class CourrierSortantModule {

}
