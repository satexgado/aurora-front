import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ServiceTypeComponent } from './type-service.component';

@NgModule({
    declarations: [
        ServiceTypeComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule
    ],
    exports: [
      ServiceTypeComponent
    ],
    entryComponents: [EditComponent],
})
export class ServiceTypeModule {

}
