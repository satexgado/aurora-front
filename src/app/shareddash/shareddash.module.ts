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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatutsuivPipe } from './pipe/statutsuiv.pipe';
import { StatutrapportPipe } from './pipe/statutrapport.pipe';
import { StatutfilelabPipe } from './pipe/statutfilelab.pipe';
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
    PartageComponent,
    StatutsuivPipe,
    StatutrapportPipe,
    StatutfilelabPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ColorPickerModule,
    FormsModule,
    RouterModule,
    CKEditorModule,
    NotificationModule,
    NgbModule
    // NgxPaginationModule,
  ],
  exports:[
    LoardingComponent,
    NoDataComponent,
    PartageComponent,
    MargePipe,
    FilterPipe,
    EscapeHtmlPipe,
    StatutsuivPipe,
    StatutrapportPipe,
    ColorPickerModule,
    DeleteConfirmationComponent,
    FormsModule,
    ReactiveFormsModule,
    CommentactionComponent,
    RouterModule,
    CKEditorModule,
    NotificationModule,
    StatutfilelabPipe,
    NgbModule

    // NgxPaginationModule,
  ]
})
export class ShareddashModule { }
