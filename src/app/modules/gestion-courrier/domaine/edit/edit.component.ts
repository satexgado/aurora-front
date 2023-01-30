import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CrDomaine, ICrDomaine } from 'src/app/core/models/gestion-courrier/cr-domaine';
import { CrDomaineFactory } from 'src/app/core/services/gestion-courrier/cr-domaine';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: CrDomaine = new CrDomaine();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrDomaineFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrDomaine) {
    return this.formBuilder.group({
      'libelle': [item.libelle, Validators.required],
      'priorite': [item.priorite, Validators.required],
      'id': [item.id]
    });
  }
}
