import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'src/app/helpers/modal/modal.module';
import { LoadingModule } from 'src/app/helpers/loading/loading.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { UiElementsModule } from './ui-elements/ui-elements.module';
import { MissingDataModule } from 'src/app/helpers/missing-data/missing-data.module';
import { NgxPicaModule, NgxPicaService } from '@digitalascetic/ngx-pica';
import { ModalSidebarModule } from 'src/app/helpers/modal-sidebar/modal-sidebar.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModalModule,
    LoadingModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMultiSelectModule,
    UiElementsModule,
    CKEditorModule,
    MissingDataModule,
    NgxPicaModule,
    NgxPaginationModule,
    ModalSidebarModule,
  ],
  exports: [
    ModalModule,
    LoadingModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMultiSelectModule,
    CKEditorModule,
    UiElementsModule,
    MissingDataModule,
    NgxPaginationModule,
    ModalSidebarModule,
  ],
})
export class SharedModule {}
