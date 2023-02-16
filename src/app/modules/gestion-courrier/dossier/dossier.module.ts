import { DossierCourrierrPipe, SingleDossierCourrierrPipe } from './dossier-courrier.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DossierComponent } from './dossier.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
    declarations: [
        DossierComponent,
        EditComponent,
        DossierCourrierrPipe,
        SingleDossierCourrierrPipe
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        AngularMultiSelectModule,
    ],
    exports: [
        DossierComponent,
    ],
    entryComponents: [EditComponent],
})
export class DossierModule {

}
