import { CourrierSelectComponent } from './courrier-select/courrier-select.component';
import { CourrierChooseItem2Component } from './choose/courrier-choose-item2.component';
import { AffectationEditComponent } from './affectation/affectation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';

@NgModule({
    declarations: [
      AffectationEditComponent,
      CourrierSelectComponent,
      CourrierChooseItem2Component
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        CustomInputModule,
    ],
    exports: [
      CourrierSelectComponent,
      CourrierChooseItem2Component
    ],
    entryComponents: [AffectationEditComponent, CourrierChooseItem2Component],
})
export class CourrierSharedModule {

}
