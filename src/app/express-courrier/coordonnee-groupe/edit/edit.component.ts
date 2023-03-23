import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrCoordonneeGroupe, ICrCoordonneeGroupe } from 'src/app/core/models/gestion-courrier/cr-coordonnee-groupe';
import { CrCoordonneeGroupeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee-groupe';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'coordonnee groupe';
  @Input() item: CrCoordonneeGroupe = new CrCoordonneeGroupe();
  @Input() groupeId = null;
  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrCoordonneeGroupeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrCoordonneeGroupe) {
    let groupe_id = item.groupe_id ? item.groupe_id : this.groupeId;
    return this.formBuilder.group({
      'groupe_id': [groupe_id],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
