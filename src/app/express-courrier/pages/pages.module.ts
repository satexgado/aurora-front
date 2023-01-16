import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageBadUrlComponent } from './page-bad-url/page-bad-url.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PageNotFoundComponent, PageBadUrlComponent],
  imports: [CommonModule, SharedModule],
  exports: [PageNotFoundComponent, PageBadUrlComponent],
})
export class PagesModule {}
