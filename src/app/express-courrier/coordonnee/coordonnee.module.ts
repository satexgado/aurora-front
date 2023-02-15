import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoordonneeComponent } from './coordonnee.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CoordonneeDetailsComponent } from './details/coordonnee-details.component';
import { CoordonneeDetailsHomeComponent } from './details/home/cood-home.component';
import { StructureModule } from '../structure/structure/structure.module';
import { CourrierEntrantModule } from 'src/app/modules/gestion-courrier/courrier-entrant/courrier-entrant.module';
import { CourrierSortantModule } from 'src/app/modules/gestion-courrier/courrier-sortant/courrier-sortant.module';
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';
import { CoodCourrierEntrantComponent } from './details/entrant/cood-centrant.component';
import { CoordonneeRoutingModule } from './coordonnee-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CoodCourrierSortantComponent } from './details/sortant/cood-csortant.component';
import { CoodMarchePublicComponent } from './details/marche-public/cood-marche-public.component';
import { ZenDocumentModule } from 'src/app/modules/gestion-document/zen-document.module';
import { CoordonneeActionComponent } from './coordonnee-action.component'
@NgModule({
    declarations: [
        CoordonneeComponent,
        CoordonneeDetailsComponent,
        CoordonneeDetailsHomeComponent,
        CoodCourrierEntrantComponent,
        CoodCourrierSortantComponent,
        CoodMarchePublicComponent,
        CoordonneeActionComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        CoordonneeRoutingModule,
        StructureModule,
        CourrierEntrantModule,
        CourrierSortantModule,
        ModalSidebarAltModule,
        InlineEditorModule,
        InfiniteScrollModule,
        AngularMultiSelectModule,
        ZenDocumentModule
    ],
    entryComponents: [EditComponent, CoordonneeActionComponent],
})
export class CoordonneeModule {

}
