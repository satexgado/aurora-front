import { PermissionEditComponent } from './permission-edit/permission-edit.component';
import { RolePermissionTemplateComponent } from './template/template.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomInputModule } from 'src/app/shared/components/custom-input/custom-input.module';
import { ModuleUtilisateurTabsUiComponent } from './module-utilisateur-tabs-ui/module-utilisateur-tabs-ui.component';
import { ModuleUtilisateurComponent } from './module-utilisateur/module-utilisateur.component';
import { RolePermissionRoutingModule } from './role-permission-routing.module';


@NgModule({
  declarations: [
    RolePermissionTemplateComponent,
    ModuleUtilisateurTabsUiComponent,
    ModuleUtilisateurComponent,
    PermissionEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InlineEditorModule,
    NgbModalModule,
    CustomInputModule,
    RolePermissionRoutingModule
  ],
  exports: [
    PermissionEditComponent
  ],
})
export class RolePermissionModule {

}
