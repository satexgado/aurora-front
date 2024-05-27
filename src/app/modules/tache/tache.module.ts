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
import { TacheHomeComponent } from './home/tache-home.component';
import { TacheCollabComponent } from './collab/tache-collab.component';
import { TacheBatchComponent } from './batch/tache-batch.component';
import { CommentaireModule } from '../commentaire';
import { Edit2Component } from './edit2/edit2.component';
import { ChooseItemModule } from '../choose-item/choose-item.module';

@NgModule({
    declarations: [
        TacheStatutPipe,
        TacheStatutObsPipe,
        TacheHomeComponent,
        TacheCollabComponent,
        TacheBatchComponent,
        GestionnaireTacheComponent,
        GestionnaireTacheKanbanComponent,
        GestionnaireTacheListComponent,
        EditComponent,
        Edit2Component
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
        ZenDocumentModule,
        CommentaireModule,
        ChooseItemModule
    ],
    exports: [
        GestionnaireTacheComponent,
        GestionnaireTacheKanbanComponent,
        GestionnaireTacheListComponent,
        TacheStatutPipe,
        TacheStatutObsPipe,
    ],
    entryComponents: [EditComponent, Edit2Component],
})
export class GestionnaireTacheModule {

}
