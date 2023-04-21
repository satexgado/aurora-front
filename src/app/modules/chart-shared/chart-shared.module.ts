import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { ChooseStateComponent } from './choose-state/choose-state.component';

@NgModule({
    declarations: [
      ChooseStateComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        CustomInputModule,
    ],
    exports: [
      ChooseStateComponent
    ],
    entryComponents: [],
})
export class ChartSharedModule {

}
