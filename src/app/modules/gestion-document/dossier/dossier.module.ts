import { SharedZenDocumentModule } from './../zen-document-share/shared.module';
import { ChooseDossierComponent } from './choose-dossier/choose-dossier.component';
import { DossierHierarchieEditComponent } from './dossier-hierarchie-edit/dossier-hierarchie-edit.component';
import { ZenDossierFichierComponent } from './dossier.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        ZenDossierFichierComponent,
        DossierHierarchieEditComponent,
        ChooseDossierComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        SharedZenDocumentModule,
        SharedZenDocumentModule
    ],
    exports: [
        ZenDossierFichierComponent,
        DossierHierarchieEditComponent,
        ChooseDossierComponent,
    ],
    entryComponents: [EditComponent, ChooseDossierComponent],
})
export class ZenDossierFichierModule {

}
