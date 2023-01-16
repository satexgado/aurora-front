import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { IMpMarcheType, MpMarcheType } from 'src/app/core/models/marche-public/type-marche.model';
import { MpMarcheTypeFactory } from 'src/app/core/services/marche-public/type-marche.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: IMpMarcheType = new MpMarcheType();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new MpMarcheTypeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IMpMarcheType) {
    return this.formBuilder.group({
      // 'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
