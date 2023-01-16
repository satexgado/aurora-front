import { IContact, Contact } from 'src/app/core/models/contact.model';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CacheService } from 'src/app/shared/services';
import { ContactFactory } from 'src/app/core/services/contact.factory';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'contact';
  @Input() item: IContact = new Contact();

  constructor(
    protected cacheService: CacheService,
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new ContactFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IContact) {
    return this.formBuilder.group({
      'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
