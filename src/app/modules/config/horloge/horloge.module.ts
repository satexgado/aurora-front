import { CustomInputModule } from './../../../shared/components/custom-input/custom-input.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HorlogeComponent } from './horloge.component';

@NgModule({
    declarations: [
        HorlogeComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        CustomInputModule,

    ],
    exports: [
      HorlogeComponent,
    ],
    entryComponents: [EditComponent],
})
export class HorlogeModule {

}
