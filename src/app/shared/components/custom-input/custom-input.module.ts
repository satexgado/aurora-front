import { CustomCheckBoxComponent } from './custom-checkbox/custom-checkbox.component';
import { NgbDateTimePicker } from './ngb-datetime/ngb-datetime.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomSelectIconComponent } from './custom-select-icon/custom-select-icon.component';
import { SelectFormGroupComponent } from './customselect/select.formgroup.component';

@NgModule({
    declarations: [
        CustomSelectIconComponent,
        SelectFormGroupComponent,
        CustomCheckBoxComponent,
        NgbDateTimePicker
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        CustomSelectIconComponent,
        SelectFormGroupComponent,
        CustomCheckBoxComponent,
        NgbDateTimePicker
    ],
    providers: []
})
export class CustomInputModule {
}
