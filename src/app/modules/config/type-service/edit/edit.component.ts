import { IServiceType, ServiceType } from 'src/app/core/models/service-type.model';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { CacheService } from 'src/app/shared/services';
import { ServiceTypeFactory } from 'src/app/core/services/service-type.factory';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'type-service';
  @Input() item: IServiceType = new ServiceType();

  constructor(
    protected cacheService: CacheService,
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new ServiceTypeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IServiceType) {
    return this.formBuilder.group({
      'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
