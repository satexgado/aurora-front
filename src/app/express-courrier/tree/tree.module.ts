import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponentComponent } from './tree-component/tree-component.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';

@NgModule({
  declarations: [TreeComponentComponent],
  imports: [CommonModule, NgbTooltipModule, ModalSidebarAltModule],
  exports: [TreeComponentComponent],
})
export class TreeModule {}
