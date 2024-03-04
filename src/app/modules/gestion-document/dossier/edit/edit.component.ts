import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CacheService } from 'src/app/shared/services';
import { Dossier, IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'masque-budget';
  @Input() item: IDossier = new Dossier();
  @Input() dossierId: number;
  @Input() relation: {
    name: string,
    id: number|any[]
  }

  constructor(
    protected cacheService: CacheService,
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new DossierFactory(),cdRef, activeModal);
  }

  changeColor(couleur) {
    const control = this.editForm.get('couleur');
    control.setValue(couleur);
    control.markAsDirty();
  }

  createFormGroup(item: IDossier) {
    const dossierid = this.dossierId ? this.dossierId : item.dossier_id;
    return this.formBuilder.group({
      'couleur': [item.couleur, Validators.required],
      'description': [item.description],
      'libelle': [item.libelle, Validators.required],
      'dossier_id': [dossierid],
      'relation_name': [this.relation ? this.relation.name : null],
      'relation_id': [this.relation ? this.relation.id : null],
      'id': [item.id]
    });
  }
}
