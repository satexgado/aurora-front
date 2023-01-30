import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceDefaultComponent } from './service-default.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
    declarations: [
        ServiceDefaultComponent,
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
    exports: [
        ServiceDefaultComponent,
    ],
    entryComponents: [EditComponent],
})
export class ServiceDefaultModule {

}
