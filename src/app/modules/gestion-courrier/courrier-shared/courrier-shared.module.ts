import { AffectationEditComponent } from './affectation/affectation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';

@NgModule({
    declarations: [
      AffectationEditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        CustomInputModule,
    ],
    entryComponents: [AffectationEditComponent],
})
export class CourrierSharedModule {

}
