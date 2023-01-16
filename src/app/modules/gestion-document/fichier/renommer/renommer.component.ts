import { Fichier, IFichier } from './../../../../core/models/gestion-document/fichier.model';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CacheService } from 'src/app/shared/services';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';

@Component({
  selector: 'app-renommer',
  templateUrl: './renommer.component.html'
})
export class RenommerComponent extends BaseEditComponent  {
  heading = 'fichier';
  @Input() item: IFichier = new Fichier();

  constructor(
    protected cacheService: CacheService,
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new FichierFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IFichier) {
    return this.formBuilder.group({
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
