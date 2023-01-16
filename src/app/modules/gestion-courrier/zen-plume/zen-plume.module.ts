import { MessageEditComponent } from './message-edit/message-edit.component';
import { MessageCreateModalComponent } from './message-create-modal/message-create-modal.component';
import { ZenPlumeMessageComponent } from './message/message.component';
import { ZenMessageDetailsComponent } from './message-details/message-details.component';
import { ZenMessageListComponent } from './message-list/message-list.component';
import { ZenPlumeTemplateComponent } from './template/template.component';
import { ZenPlumeRoutingModule } from './zen-plume-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownSelectModule } from 'src/app/dropdown-select/dropdown-select.module';
import { UploadModule } from 'src/app/upload';


@NgModule({
  declarations: [
    ZenPlumeTemplateComponent,
    ZenMessageListComponent,
    ZenMessageDetailsComponent,
    ZenPlumeMessageComponent,
    MessageCreateModalComponent,
    MessageEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModalModule,
    DropdownSelectModule,
    UploadModule,
  ],
  exports: [
  ],
  entryComponents: [
    MessageCreateModalComponent,
    MessageEditComponent
  ]
})
export class ZenPlumeModule {

}
