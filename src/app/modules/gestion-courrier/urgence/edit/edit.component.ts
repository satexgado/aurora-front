import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrUrgence, ICrUrgence } from 'src/app/core/models/gestion-courrier/cr-urgence';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'urgence';
  @Input() item: CrUrgence = new CrUrgence();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrUrgenceFactory(),cdRef, activeModal);
  }

  changeColor(couleur) {
    const control = this.editForm.get('couleur');
    control.setValue(couleur);
    control.markAsDirty();
  }

  createFormGroup(item: ICrUrgence) {
    return this.formBuilder.group({
      'delai': [item.delai, Validators.required],
      'couleur': [item.couleur, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
