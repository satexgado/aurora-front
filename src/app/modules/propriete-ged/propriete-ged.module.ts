import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { ProprieteGedRoutingModule } from './propriete-ged-routing.module';
import { ProprieteGedComponent } from './propriete-ged.component';
import { ModeleModule } from './modele/modele.module'

@NgModule({
    declarations: [
        ProprieteGedComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        CustomInputModule,
        InfiniteScrollModule,
        AngularMultiSelectModule,
        DragDropModule,
        ProprieteGedRoutingModule,
        ModeleModule
    ],
    exports: [
        
    ],
    entryComponents: [],
})
export class ProprieteGedModule {

}
