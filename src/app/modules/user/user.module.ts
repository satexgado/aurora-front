import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserComponent } from './user.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CourrierEntrantModule } from 'src/app/modules/gestion-courrier/courrier-entrant/courrier-entrant.module';
import { CourrierSortantModule } from 'src/app/modules/gestion-courrier/courrier-sortant/courrier-sortant.module';
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';
import { UserRoutingModule } from './user-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ZenDocumentModule } from 'src/app/modules/gestion-document/zen-document.module';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { UserDetailsComponent } from './details/user-details.component';
import { UserDetailsHomeComponent } from './details/home/ud-home.component';

@NgModule({
    declarations: [
        UserComponent,
        UserDetailsComponent,
        UserDetailsHomeComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule,
        CourrierEntrantModule,
        CourrierSortantModule,
        ModalSidebarAltModule,
        InlineEditorModule,
        InfiniteScrollModule,
        AngularMultiSelectModule,
        ZenDocumentModule,
        CustomInputModule
    ],
    entryComponents: [EditComponent],
})
export class UserModule {

}
