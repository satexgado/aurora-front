import { ServiceFactory } from 'src/app/core/services/service.factory';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html'
})
export class ServiceComponent extends EditableListComponent {

  editModal = EditComponent;

  constructor(
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new ServiceFactory(), new QueryOptions(
      [
        {or: false, filters:[new Filter('isIns', true, 'eq')]},
        {or: true, filters:[new Filter('searchString', '', 'ct')]},
    ],
    ['visi_type_service'],
    64,
    1,
    [new Sort('updated_at','DESC')]
    )));
    this.modalService = modalService;
  }

}
