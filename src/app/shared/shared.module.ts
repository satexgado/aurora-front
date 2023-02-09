import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ColorPickerModule } from 'ngx-color-picker';
import { TreeviewModule } from 'ngx-treeview';
import { EnvironmentModule } from './environment/environment.module';
import { FormatFileSizePipe } from './pipes/format-file-size.pipe';
import { DateagoPipe } from './pipes/dateago.pipe';
import { DateagoPipeFr } from './pipes/dateagofr.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationModule } from './notification';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  Select2Directive,
  Select2DefaultDirective,
  SelectFirstOptionDirective,
  NgbdSortableHeader,
  AutofocusDirective,
  HighlightDirective
} from './directives';
import {
  ShortenPipe,
  CapitalizeFirstPipe,
  SlugifyPipe,
  ReplaceBarPipe,
  ShortNumberPipe,
  SortByPipe,
  RemoveBarPipe,
  SearchFilterPipe,
  FichierTypeFilterPipe,
  CountPipe,
  SelectedSortPipe,
  SearchFilterObsPipe,
  BaseColumnIdFilterPipe
} from './pipes';
import { CallbackPipe } from './pipes/callback.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationsModule } from '../express-courrier/notifications/notifications.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';

@NgModule({
  declarations: [
    Select2Directive,
    Select2DefaultDirective,
    SelectFirstOptionDirective,
    AutofocusDirective,
    HighlightDirective,
    NgbdSortableHeader,
    ShortenPipe,
    CapitalizeFirstPipe,
    SlugifyPipe,
    ReplaceBarPipe,
    RemoveBarPipe,
    ShortNumberPipe,
    SortByPipe,
    CallbackPipe,
    DateagoPipeFr,
    DateagoPipe,
    FormatFileSizePipe,
    SearchFilterPipe,
    FichierTypeFilterPipe,
    CountPipe,
    SelectedSortPipe,
    SearchFilterObsPipe,
    BaseColumnIdFilterPipe
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ColorPickerModule,
    NotificationsModule,
    CKEditorModule,
    TreeviewModule,
    InfiniteScrollModule,
    EnvironmentModule,
    NgxDocViewerModule,
  ],
  exports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    Select2Directive,
    Select2DefaultDirective,
    SelectFirstOptionDirective,
    AutofocusDirective,
    HighlightDirective,
    NgbdSortableHeader,
    NgbModule,
    NgxDocViewerModule,
    EnvironmentModule,
    ShortenPipe,
    CapitalizeFirstPipe,
    SlugifyPipe,
    ReplaceBarPipe,
    ShortNumberPipe,
    SortByPipe,
    RemoveBarPipe,
    RouterModule,
    ColorPickerModule,
    CKEditorModule,
    TreeviewModule,
    InfiniteScrollModule,
    CallbackPipe,
    DateagoPipeFr,
    DateagoPipe,
    FormatFileSizePipe,
    SearchFilterPipe,
    FichierTypeFilterPipe,
    CountPipe,
    SelectedSortPipe,
    SearchFilterObsPipe,
    BaseColumnIdFilterPipe
  ],
})
export class SharedModule {}
