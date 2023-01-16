import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrMoyenSuivi, ICrMoyenSuivi } from 'src/app/core/models/gestion-courrier/cr-moyen-suivi';
import { CrMoyenSuiviFactory } from 'src/app/core/services/gestion-courrier/cr-moyen-suivi';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'moyen-suivi';
  @Input() item: CrMoyenSuivi = new CrMoyenSuivi();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrMoyenSuiviFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrMoyenSuivi) {
    return this.formBuilder.group({
      'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
