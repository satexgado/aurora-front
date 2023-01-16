import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, Validators, FormControl } from '@angular/forms';
import { CrNature, ICrNature } from 'src/app/core/models/gestion-courrier/cr-nature';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { JsonFormControlEnum } from 'src/app/core/models/json-form/json-form-control';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EditComponent extends BaseEditComponent  {
  heading = 'nature';
  @Input() item: CrNature = new CrNature();
  typeEnum = JsonFormControlEnum;

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrNatureFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrNature) {

    let form_fields =   this.formBuilder.array([]);

    if(item.form_fields && item.form_fields.length) {
      item.form_fields.forEach(
        (field)=> {
          form_fields.push(this.formBuilder.group({
            'required': [field.required, Validators.required],
            'name': [field.libelle, Validators.required],
            'type': [field.type, Validators.required],
            id: [field.id]
          }))
        }
      )
    }

    return this.formBuilder.group({
      'removedFormField': [],
      'form_field': form_fields,
      'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

  addFormField() {
    const control = this.editForm.get('form_field') as FormArray;
    control.push(this.formBuilder.group({
      'required': [true, Validators.required],
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      id: [0]
    }));
  }

  removeFormField(child_index) {
    const control = this.editForm.get('form_field') as FormArray;
    control.markAsDirty();
    if(control.at(child_index).get('id').value) {
      const removeControl = this.editForm.get('removedFormField') as FormControl;
      let data = removeControl.value ? removeControl.value : [];
      data.push(control.at(child_index).get('id').value);
      removeControl.setValue(data);
    }
    control.removeAt(child_index);
 }
}
