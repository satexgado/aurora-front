import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxListComponent } from './inbox-list/inbox-list.component';
import { RouterModule } from '@angular/router';
import { InboxComponent } from './inbox.component';
import { InboxSoloComponent } from './inbox-solo/inbox-solo.component';
import { InboxMissingDataComponent } from './inbox-missing-data/inbox-missing-data.component';

@NgModule({
  declarations: [InboxListComponent, InboxComponent, InboxSoloComponent, InboxMissingDataComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [InboxListComponent, InboxComponent],
})
export class InboxModule {}
