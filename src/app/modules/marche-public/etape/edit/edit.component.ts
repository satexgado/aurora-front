import { MpEtapeFactory } from 'src/app/core/services/marche-public/etape.model';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { IMpEtape, MpEtape } from 'src/app/core/models/marche-public/etape.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: IMpEtape = new MpEtape();

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new MpEtapeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IMpEtape) {
    return this.formBuilder.group({
      // 'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
