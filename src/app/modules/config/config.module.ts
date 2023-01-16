import { HorlogeModule } from './horloge/horloge.module';
import { ServiceContactUiComponent } from './service-contact-ui/service-contact-ui.component';
import { ContactModule } from './contact/contact.module';
import { ServiceTypeModule } from './type-service/type-service.module';
import { ServiceModule } from './service/service.module';
import { ConfigTemplateComponent } from './template/template.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { ConfigRoutingModule } from './config-routing.module';


@NgModule({
  declarations: [
   ConfigTemplateComponent,
   ServiceContactUiComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InlineEditorModule,
    NgbModalModule,
    CustomInputModule,
    ContactModule,
    ServiceModule,
    ServiceTypeModule,
    HorlogeModule,
    ConfigRoutingModule,
  ],
  exports: [
    ConfigTemplateComponent
  ],
})
export class ConfigModule {

}
