import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { StructureSoloComponent } from './structure-solo/structure-solo.component';
import { StructureCreateComponent } from './structure-create/structure-create.component';
import { StructureEditComponent } from './structure-edit/structure-edit.component';
import { RouterModule } from '@angular/router';
import { StructureFilterComponent } from '../structure-filter/structure-filter.component';

@NgModule({
  declarations: [
    StructureSoloComponent,
    StructureCreateComponent,
    StructureEditComponent,
    StructureFilterComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [
    StructureSoloComponent,
    StructureCreateComponent,
    StructureEditComponent,
    StructureFilterComponent,
  ],
})
export class StructureSharedModule {}
