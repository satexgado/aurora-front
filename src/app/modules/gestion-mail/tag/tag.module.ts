import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MailTagComponent } from './tag.component';

@NgModule({
    declarations: [
        MailTagComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule
    ],
    entryComponents: [EditComponent],
})
export class MailTagModule {

}
