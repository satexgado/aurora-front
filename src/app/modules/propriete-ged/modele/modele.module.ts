import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModeleComponent } from './modele.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UploadModule } from 'src/app/upload';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';

@NgModule({
    declarations: [
        ModeleComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        CustomInputModule,
        UploadModule
    ],
    exports: [
        ModeleComponent,
    ],
    entryComponents: [EditComponent],
})
export class ModeleModule {

}
