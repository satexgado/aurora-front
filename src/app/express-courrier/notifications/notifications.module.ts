import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { SharedModule } from '../shared/shared.module';
import { NotificationMissingComponent } from './notification-missing/notification-missing.component';

@NgModule({
  declarations: [NotificationsComponent, NotificationsListComponent, NotificationMissingComponent],
  imports: [CommonModule, SharedModule],
  exports: [NotificationsComponent, NotificationsListComponent],
})
export class NotificationsModule {}
