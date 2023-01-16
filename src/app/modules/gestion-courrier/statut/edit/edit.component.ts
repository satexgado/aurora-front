import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrStatut, ICrStatut } from 'src/app/core/models/gestion-courrier/cr-statut';
import { CrStatutFactory } from 'src/app/core/services/gestion-courrier/cr-statut';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: CrStatut = new CrStatut();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrStatutFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrStatut) {
    return this.formBuilder.group({
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
