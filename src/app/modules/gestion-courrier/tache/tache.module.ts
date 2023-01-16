import { AffectationTacheEditComponent } from './affectation/affectation.component';
import { TacheStatutEditComponent } from './statut-edit/edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TacheComponent } from './tache.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
    declarations: [
        TacheComponent,
        TacheStatutEditComponent,
        AffectationTacheEditComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        CustomInputModule,
        AngularMultiSelectModule
    ],
    entryComponents: [EditComponent, AffectationTacheEditComponent, TacheStatutEditComponent],
})
export class TacheModule {

}
