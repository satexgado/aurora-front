import { IContact } from 'src/app/core/models/contact.model';
import { ContactFactory } from 'src/app/core/services/contact.factory';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent extends EditableListComponent {

  editModal = EditComponent;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new ContactFactory()));
    this.modalService = modalService;
  }
}
