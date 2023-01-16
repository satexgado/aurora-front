import { ChooseItem2Component } from './single2/choose-item2.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChooseMultiItem2Component } from './multi2/choose-multi-item2.component';

@NgModule({
    declarations: [
        ChooseMultiItem2Component,
        ChooseItem2Component
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        ChooseMultiItem2Component,
        ChooseItem2Component
    ],
    entryComponents: [
        ChooseMultiItem2Component,
        ChooseItem2Component
    ]
})
export class ChooseItemModule {

}