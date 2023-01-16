import { ShareMultiselect2Component } from './share-multiselect2/share-multiselect2.component';
import { SharedBaseComponent } from './shared.base.component';
import { ShareComponent } from './share/share.component';
import { CheckPassComponent } from './checkpass/checkpass.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BloquerComponent } from './bloquer/bloquer.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';



@NgModule({
  declarations: [
    BloquerComponent,
    CheckPassComponent,
    ShareComponent,
    SharedBaseComponent,
    ShareMultiselect2Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    AngularMultiSelectModule
  ],
  exports: [
    CommonModule,
    SharedModule,
    SharedBaseComponent,
    BloquerComponent, CheckPassComponent, ShareComponent, ShareMultiselect2Component
  ],
  entryComponents: [BloquerComponent, CheckPassComponent, ShareComponent, ShareMultiselect2Component]
})
export class SharedZenDocumentModule {

}
