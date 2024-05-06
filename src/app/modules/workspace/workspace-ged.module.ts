import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { WorkspaceGedRoutingModule } from './workspace-ged-routing.module';
import { WorkspaceGedComponent } from './workspace-ged.component';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { SharedZenDocumentModule } from '../gestion-document/zen-document-share/shared.module';
import { EditComponent} from './workspace-list/edit/edit.component'
import { GedWorkspaceUiComponent } from './workspace-ui/workspace-ui.component'
import { WorkspaceMembreComponent } from './workspace-membres/workspace-membre.component';
import { ChooseItemModule } from '../choose-item/choose-item.module';
import { WorkspaceCoordonneeComponent } from './workspace-coordonnee/workspace-coordonnee.component'
import { CalendrierModule } from 'src/app/modules/calendrier/calendrier.module';
import { GestionnaireTacheModule } from '../tache/tache.module';
import { ZenDocumentModule } from '../gestion-document/zen-document.module';
import { GedWorkspaceDetailsUiComponent } from './workspace-details-ui/workspace-details-ui.component';
import { WorkspaceTableauComponent } from './workspace-tableau/workspace-tableau.component';
import { WorkspaceTacheComponent } from './workspace-tache/workspace-tache.component';
import { WorkspaceProdocComponent } from './workspace-prodoc/workspace-prodoc.component'

@NgModule({
    declarations: [
        WorkspaceGedComponent,
        WorkspaceListComponent,
        GedWorkspaceUiComponent,
        WorkspaceMembreComponent,
        WorkspaceCoordonneeComponent,
        WorkspaceTableauComponent,
        WorkspaceTacheComponent,
        GedWorkspaceDetailsUiComponent,
        WorkspaceProdocComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        CustomInputModule,
        InfiniteScrollModule,
        AngularMultiSelectModule,
        DragDropModule,
        WorkspaceGedRoutingModule,
        SharedZenDocumentModule,
        ZenDocumentModule,
        AngularMultiSelectModule,
        ChooseItemModule,
        CalendrierModule,
        GestionnaireTacheModule
    ],
    exports: [
        
    ],
    entryComponents: [EditComponent],
})
export class WorkspaceGedModule {

}
