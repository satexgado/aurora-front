import { MultipleFileUploadComponent } from './multiple-file-upload/multiple-file-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';

@NgModule({
    declarations: [
        FileUploadComponent,
        ImageUploadComponent,
        VideoUploadComponent,
        MultipleFileUploadComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        FileUploadComponent,
        ImageUploadComponent,
        VideoUploadComponent
    ],
    providers: []
})
export class UploadModule {

}
