import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ImageModalComponent } from './image-modal.component';
@NgModule({
    declarations: [
        ImageModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [ImageModalComponent],
    entryComponents: [ImageModalComponent]
})
export class ImageModalModule {

}