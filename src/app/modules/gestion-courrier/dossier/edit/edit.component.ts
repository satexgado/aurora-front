import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrDossier, ICrDossier } from 'src/app/core/models/gestion-courrier/cr-dossier';
import { CrDossierFactory } from 'src/app/core/services/gestion-courrier/cr-dossier';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'dossier';
  @Input() item: CrDossier = new CrDossier();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrDossierFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrDossier) {
    return this.formBuilder.group({
      // 'structure_id': [item.structure_id, Validators.required],
      // 'responsable_id': [item.responsable_id, Validators.required],
      'objet': [item.objet, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
