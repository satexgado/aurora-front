import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectItemDropdownComponent } from './select/select-item-dropdown.component';
@NgModule({
    declarations: [
        SelectItemDropdownComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        SelectItemDropdownComponent
    ]
})
export class DropdownSelectModule {

}