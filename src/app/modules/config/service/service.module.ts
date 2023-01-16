import { ServiceDetailsHierarchieComponent } from './details/hierarchie-ui/sd-hierarchie-ui.component';
import { ServiceDetailsPermissionComponent } from './details/permission-ui/sd-permission-ui.component';
import { ChooseItemModule } from './../../choose-item/choose-item.module';
import { ServiceDetailsContactComponent } from './details/contact-ui/sd-contact-ui.component';
import { ServiceDetailsInformationComponent } from './details/information-ui/sd-information-ui.component';
import { ServiceDetailsComponent } from './details/service-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ServiceComponent } from './service.component';
import { RolePermissionModule } from '../role-permission/role-permission.module';

@NgModule({
    declarations: [
        ServiceComponent,
        ServiceDetailsComponent,
        ServiceDetailsInformationComponent,
        ServiceDetailsContactComponent,
        ServiceDetailsPermissionComponent,
        ServiceDetailsHierarchieComponent,
        EditComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        ChooseItemModule,
        RolePermissionModule,
      ],
    exports: [
      ServiceComponent,
    ],
    entryComponents: [EditComponent],
})
export class ServiceModule {

}
