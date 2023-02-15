import { CoordonneeGroupeActionComponent } from './coordonnee-action.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoordonneeGroupeComponent } from './coordonnee-groupe.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StructureModule } from '../structure/structure/structure.module';
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';
import { CoordonneeGroupeRoutingModule } from './coordonnee-groupe-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ZenDocumentModule } from 'src/app/modules/gestion-document/zen-document.module';
import { AffectationCoordonneeGroupeEditComponent } from './affectation/affectation.component';

@NgModule({
    declarations: [
        CoordonneeGroupeComponent,
        AffectationCoordonneeGroupeEditComponent,
        CoordonneeGroupeActionComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        CoordonneeGroupeRoutingModule,
        StructureModule,
        ModalSidebarAltModule,
        InlineEditorModule,
        InfiniteScrollModule,
        AngularMultiSelectModule,
        ZenDocumentModule
    ],
    entryComponents: [EditComponent, AffectationCoordonneeGroupeEditComponent, CoordonneeGroupeActionComponent],
})
export class CoordonneeGroupeModule {

}
