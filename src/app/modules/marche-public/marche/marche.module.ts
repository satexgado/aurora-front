import { ZenDocumentModule } from './../../gestion-document/zen-document.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarcheComponent } from './marche.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MarcheDetailsFichierComponent } from './fichier/marche-fichier.component';
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';
import { StructureModule } from 'src/app/express-courrier/structure/structure/structure.module'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChooseItemModule } from '../../choose-item/choose-item.module';

@NgModule({
    declarations: [
        MarcheComponent,
        MarcheDetailsFichierComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        CustomInputModule,
        AngularMultiSelectModule,
        ZenDocumentModule,
        ModalSidebarAltModule,
        StructureModule,
        DragDropModule,
        ChooseItemModule
    ],
    exports: [
        MarcheComponent,
    ],
    entryComponents: [EditComponent],
})
export class MarcheModule {

}
