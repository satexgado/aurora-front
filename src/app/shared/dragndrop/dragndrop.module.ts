import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragService } from './drag.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
  ],
  declarations: [DroppableDirective, DraggableDirective],
  exports: [DroppableDirective, DraggableDirective]
})
export class DragNDropModule { }
