import { JsonFormControlFactory } from 'src/app/core/services/json-form/json-form-control';
import { JsonFormControl, IJsonFormControl, JsonFormControlEnum } from 'src/app/core/models/json-form/json-form-control';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'json form control';
  @Input() item: IJsonFormControl = new JsonFormControl();

  typeEnum = JsonFormControlEnum;

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new JsonFormControlFactory(),cdRef, activeModal);
  }

  changeColor(couleur) {
    const control = this.editForm.get('couleur');
    control.setValue(couleur);
    control.markAsDirty();
  }

  createFormGroup(item: IJsonFormControl) {
    return this.formBuilder.group({
      'libelle': [item.libelle, Validators.required],
      'label': [item.label, Validators.required],
      'value': [item.value, Validators.required],
      'type': [item.type, Validators.required],
      'required': [item.required, Validators.required],
      'id': [item.id]
    });
  }
}
