import { ReadMoreComponent } from './../../shared/ui-elements/read-more/read-more.component';
// import { ReadMoreComponent } from './interne/read-more.component';
import { EditLittleBoxComponent } from './edit-littlebox/edit.component';
import { MailActionComponent } from './gestion-mail-action.component';
import { ChooseItemModule } from './../choose-item/choose-item.module';
import { GestionMailsDetailsComponent } from './mail-details/mail-details.component';
import { GestionMailInboxComponent } from './inbox/inbox.component';
import { EditComponent } from './edit/edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SidebarMailComponent } from './sidebar-mail/sidebar-mail.component';
import { GestionMailTemplateComponent } from './template/template.component';
import { GestionMailRoutingModule } from './gestion-mail-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GestionMailUiComponent } from './ui/template-ui.component';
import { GestionMailInterneComponent } from './interne/interne.component'
import { MailTagModule } from './tag/tag.module';

@NgModule({
  declarations: [
    SidebarMailComponent,
    GestionMailTemplateComponent,
    GestionMailInboxComponent,
    GestionMailsDetailsComponent,
    GestionMailUiComponent,
    GestionMailInterneComponent,
    MailActionComponent,
    EditComponent,
    EditLittleBoxComponent,
    ReadMoreComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GestionMailRoutingModule,
    AngularMultiSelectModule,
    ChooseItemModule,
    MailTagModule
  ],
  exports: [
    EditLittleBoxComponent
  ],
  providers: [
  ],
  entryComponents: [
    EditComponent
  ]
})
export class GestionMailModule {

}
