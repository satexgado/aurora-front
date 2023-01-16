import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { GestionnaireTacheComponent } from './tache.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GestionnaireTacheRoutingModule } from './tache-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ZenDocumentModule } from 'src/app/modules/gestion-document/zen-document.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { TacheModule } from 'src/app/modules/gestion-courrier/tache/tache.module';
import { GestionnaireTacheKanbanComponent } from './kanban/tache-kanban.component'
import { TacheStatutObsPipe, TacheStatutPipe } from './tache-statut.pipe'
import { GestionnaireTacheListComponent } from './list/tache-list.component';
@NgModule({
    declarations: [
        TacheStatutPipe,
        TacheStatutObsPipe,
        GestionnaireTacheComponent,
        GestionnaireTacheKanbanComponent,
        GestionnaireTacheListComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        GestionnaireTacheRoutingModule,
        InlineEditorModule,
        CustomInputModule,
        InfiniteScrollModule,
        AngularMultiSelectModule,
        TacheModule,
        DragDropModule,
        ZenDocumentModule
    ],
    entryComponents: [EditComponent],
})
export class GestionnaireTacheModule {

}
