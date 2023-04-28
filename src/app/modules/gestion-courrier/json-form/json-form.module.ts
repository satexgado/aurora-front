import { JsonForm2Component } from './form/json-form2.component';
import { DragNDropModule } from 'src/app/shared/dragndrop/dragndrop.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { JsonFormComponent } from './json-form.component';
import { JsonFormControlListComponent } from './list/json-form-list.component';
import { EditComponent} from './list/edit/edit.component'
import { EditGroupComponent } from './list/edit-group/edit-group.component';

@NgModule({
    declarations: [
        JsonFormComponent,
        JsonForm2Component,
        JsonFormControlListComponent,
        EditComponent,
        EditGroupComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        DragNDropModule
    ],
    exports: [
      JsonFormComponent,
      JsonForm2Component
    ],
    entryComponents: [EditComponent, EditGroupComponent],
})
export class JsonFormModule {

}
