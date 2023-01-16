import { JsonFormControlFactory } from 'src/app/core/services/json-form/json-form-control';
import { JsonFormControl, IJsonFormControl, JsonFormControlEnum } from 'src/app/core/models/json-form/json-form-control';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html'
})
export class EditGroupComponent extends BaseEditComponent  {
  heading = 'json form control';
  @Input() item: IJsonFormControl = new JsonFormControl();

  typeEnum = JsonFormControlEnum;

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new JsonFormControlFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IJsonFormControl) {
    return this.formBuilder.group({
      'inputs': this.formBuilder.array([]),
      'id': [item.id]
    });
  }

  addPointArret() {
    const control = this.editForm.get('inputs') as FormArray;
    control.push(this.formBuilder.group({
      'require': [''],
      'libelle': [''],
      'type': []
    }));
  }

  removePointArret(child_index) {
    const control = this.editForm.get('inputs') as FormArray;
    control.markAsDirty();
    control.removeAt(child_index);
 }
}
