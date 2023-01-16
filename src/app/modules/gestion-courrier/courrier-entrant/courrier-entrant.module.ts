import { JsonFormModule } from './../json-form/json-form.module';
import { CourrierEntrantDetailsReaffectationComponent } from './details/ced-reaffectation/ced-reaffectation.component';
import { AffectationCourrierEditComponent } from './affectation/affectation.component';
import { ClotureCourrierEditComponent } from './cloture-edit/edit.component';
import { CourrierEntrantDetailsMyTaskComponent } from './details/ced-my-task/ced-my-task.component';
import { CourrierEntrantDetailsTacheComponent } from './details/ced-tache/ced-tache.component';
import { CourrierEntrantDetailsHomeComponent } from './details/ced-home/ced-home.component';
import { CourrierEtapeStatutEditComponent } from './details/ced-courrier-etape-statut/edit.component';
import { CourrierEntrantDetailsSuiviComponent } from './details/ced-suivi/ced-suivi.component';
import { CourrierEntrantDetailsCommentComponent } from './details/ced-comment/ced-comment.component';
import { ZenPlumeModule } from './../zen-plume/zen-plume.module';
import { CourrierEntrantActionAffectationComponent } from './action-affectation/ceaf.component';
import { ZenFichierModule } from 'src/app/modules/gestion-document/fichier/fichier.module';
import { CourrierEntrantDetailsFichierComponent } from './details/ced-fichier/ced-fichier.component';
import { CourrierEntrantDetailsFormComponent } from './details/ced-form/ced-form.component';
import { CourrierEntrantDetailsComponent } from './details/courrier-entrant-details.component';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CourrierEntrantComponent } from './courrier-entrant.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ZenDocumentModule } from '../../gestion-document/zen-document.module';
import { CourrierEntrantKanbanComponent } from './kanban/cek.component'
import { CourrierSharedModule } from '../courrier-shared/courrier-shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TacheModule } from '../tache/tache.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { UploadModule } from 'src/app/upload';

@NgModule({
    declarations: [
        CourrierEntrantComponent,
        CourrierEntrantDetailsComponent,
        CourrierEntrantDetailsFormComponent,
        CourrierEntrantDetailsFichierComponent,
        CourrierEntrantDetailsCommentComponent,
        CourrierEntrantDetailsSuiviComponent,
        CourrierEntrantDetailsHomeComponent,
        CourrierEntrantDetailsTacheComponent,
        CourrierEntrantDetailsMyTaskComponent,
        CourrierEntrantKanbanComponent,
        EditComponent,
        CourrierEntrantActionAffectationComponent,
        CourrierEtapeStatutEditComponent,
        ClotureCourrierEditComponent,
        AffectationCourrierEditComponent,
        CourrierEntrantDetailsReaffectationComponent
    ],
    exports: [
        CourrierEntrantDetailsComponent,
        CourrierEntrantDetailsFormComponent,
        CourrierEntrantDetailsFichierComponent,
        CourrierEntrantDetailsCommentComponent,
        CourrierEntrantDetailsSuiviComponent,
        CourrierEntrantDetailsHomeComponent,
        CourrierEntrantDetailsTacheComponent,
        CourrierEntrantDetailsMyTaskComponent,
        CourrierEntrantDetailsReaffectationComponent,
        ClotureCourrierEditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        CustomInputModule,
        ZenDocumentModule,
        ZenFichierModule,
        CourrierSharedModule,
        DragDropModule,
        ZenPlumeModule,
        TacheModule,
        AngularMultiSelectModule,
        JsonFormModule,
        UploadModule
    ],
    entryComponents: [AffectationCourrierEditComponent, ClotureCourrierEditComponent, CourrierEntrantDetailsFormComponent, EditComponent, CourrierEtapeStatutEditComponent],
})
export class CourrierEntrantModule {

}
