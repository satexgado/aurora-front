import { ShareMultiselect2Component } from './share-multiselect2/share-multiselect2.component';
import { SharedBaseComponent } from './shared.base.component';
import { ShareComponent } from './share/share.component';
import { CheckPassComponent } from './checkpass/checkpass.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BloquerComponent } from './bloquer/bloquer.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ShareWTypeComponent } from './share-wtype/share-wtype.component';
import {IconChooseMultiItem2Component} from './icon-choose-multi/icon-choose-multi-item2.component' ;
import { IconChooseItem2Component } from './icon-choose-multi/icon-choose-item.component'
import { ItemSelectComponent } from './icon-select/icon-select.component';

@NgModule({
  declarations: [
    BloquerComponent,
    CheckPassComponent,
    ShareComponent,
    SharedBaseComponent,
    ShareMultiselect2Component,
    ShareWTypeComponent,
    IconChooseMultiItem2Component,
    IconChooseItem2Component,
    ItemSelectComponent
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
    BloquerComponent, CheckPassComponent, ShareComponent, ShareMultiselect2Component,
    IconChooseMultiItem2Component,
    IconChooseItem2Component,
    ItemSelectComponent
  ],
  entryComponents: [BloquerComponent, CheckPassComponent, ShareComponent, ShareMultiselect2Component, ShareWTypeComponent, IconChooseMultiItem2Component, IconChooseItem2Component]
})
export class SharedZenDocumentModule {

}
