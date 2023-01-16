import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrCourrierInterne, ICrCourrierInterne } from 'src/app/core/models/gestion-courrier/cr-courrier-interne';
import { CrCourrierInterneFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-interne';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'courrier-interne';
  @Input() item: CrCourrierInterne = new CrCourrierInterne();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrCourrierInterneFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrCourrierInterne) {
    return this.formBuilder.group({
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
