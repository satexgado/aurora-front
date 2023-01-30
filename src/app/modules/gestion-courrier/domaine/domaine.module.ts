import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DomaineComponent } from './domaine.component';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        DomaineComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule
    ],
    exports: [
        DomaineComponent,
    ],
    entryComponents: [EditComponent],
})
export class DomaineModule {

}
