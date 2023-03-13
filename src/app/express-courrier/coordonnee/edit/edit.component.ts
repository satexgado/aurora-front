import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrCoordonnee, ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'coordonnee';
  @Input() item: CrCoordonnee = new CrCoordonnee();
  tagList = [
    {
      id: 'fournisseur',
      libelle: 'fournisseur'
    },
    {
      id: 'partenaire',
      libelle: 'partenaire'
    }
  ]
  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrCoordonneeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrCoordonnee) {
    return this.formBuilder.group({
      'tag': [item.tag, Validators.required],
      'email': [item.email, Validators.required],
      'telephone': [item.telephone, Validators.required],
      'adresse': [item.adresse, Validators.required],
      'condition_suivi': [item.condition_suivi],
      'commentaire': [item.commentaire],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
