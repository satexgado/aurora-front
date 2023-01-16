import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonElementCreateComponent } from './common-element-create/common-element-create.component';
import { CommonElementEditComponent } from './common-element-edit/common-element-edit.component';
import { SharedModule } from './../shared.module';

@NgModule({
  declarations: [CommonElementCreateComponent, CommonElementEditComponent],
  imports: [CommonModule, SharedModule],
  exports: [CommonElementCreateComponent, CommonElementEditComponent],
})
export class CommonElementModule {}
