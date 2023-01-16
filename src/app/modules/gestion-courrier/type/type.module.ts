import { EtapeModule } from './../etape/etape.module';
import { TypeCardEditComponent } from './card-edit/type-card-edit.component';
import { TypeHierarchieEditComponent } from './hierarchie-edit/type-hierarchie-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TypeComponent } from './type.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        TypeComponent,
        TypeHierarchieEditComponent,
        TypeCardEditComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        DragDropModule,
        EtapeModule
    ],
    exports: [
        TypeComponent,
        TypeHierarchieEditComponent,
        TypeCardEditComponent,
    ],
    entryComponents: [EditComponent],
})
export class TypeModule {

}
