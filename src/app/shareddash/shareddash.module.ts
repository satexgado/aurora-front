import { NotificationModule } from 'src/app/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoardingComponent } from './loarding/loarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoDataComponent } from './no-data/no-data.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { CommentactionComponent } from './commentaction/commentaction.component';
import { RouterModule } from '@angular/router';
import { PartageComponent } from './partage/partage.component';
import { FilterPipe } from './pipe/filter.pipe';
import { MargePipe } from './pipe/marge.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EscapeHtmlPipe } from './pipe/afficheHTML.pipe';
// import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    LoardingComponent,
    NoDataComponent,
    MargePipe,
    FilterPipe,
    EscapeHtmlPipe,
    DeleteConfirmationComponent,
    CommentactionComponent,
    PartageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ColorPickerModule,
    FormsModule,
    RouterModule,
    CKEditorModule,
    NotificationModule
    // NgxPaginationModule,
  ],
  exports:[
    LoardingComponent,
    NoDataComponent,
    PartageComponent,
    MargePipe,
    FilterPipe,
    EscapeHtmlPipe,
    ColorPickerModule,
    DeleteConfirmationComponent,
    FormsModule,
    ReactiveFormsModule,
    CommentactionComponent,
    RouterModule,
    CKEditorModule,
    NotificationModule
    // NgxPaginationModule,
  ]
})
export class ShareddashModule { }
