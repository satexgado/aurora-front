import { ProcedureTypeHomeComponent } from './home/procedure-type-home.component';
import { ChooseProcedureComponent } from './choose-procedure/choose-procedure.component';
import { ProcedureHierarchieEditComponent } from './procedure-hierarchie-edit/procedure-hierarchie-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProcedureTypeComponent } from './procedure-type.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        ProcedureTypeComponent,
        ProcedureHierarchieEditComponent,
        ProcedureTypeHomeComponent,
        ChooseProcedureComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        DragDropModule,
    ],
    exports: [
        ProcedureTypeComponent,
    ],
    entryComponents: [EditComponent],
})
export class ProcedureTypeModule {

}
