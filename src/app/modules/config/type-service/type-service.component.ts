import { ServiceTypeFactory } from 'src/app/core/services/service-type.factory';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';


@Component({
  selector: 'app-type-service',
  templateUrl: './type-service.component.html'
})
export class ServiceTypeComponent extends EditableListComponent {

  editModal = EditComponent;

  constructor(
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new ServiceTypeFactory()));
    this.modalService = modalService;
  }
}
