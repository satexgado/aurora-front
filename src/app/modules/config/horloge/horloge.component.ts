import { HorlogeFactory } from 'src/app/core/services/horloge.factory';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';


@Component({
  selector: 'app-horloge',
  templateUrl: './horloge.component.html'
})
export class HorlogeComponent extends EditableListComponent {

  editModal = EditComponent;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new HorlogeFactory()));
    this.modalService = modalService;
  }
}
