import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrType, ICrType } from 'src/app/core/models/gestion-courrier/cr-type';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'type';
  @Input() item: CrType = new CrType();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrTypeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrType) {
    return this.formBuilder.group({
      'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
