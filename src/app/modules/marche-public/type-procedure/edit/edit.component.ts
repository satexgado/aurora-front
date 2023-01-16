import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { IMpProcedureType, MpProcedureType } from 'src/app/core/models/marche-public/type-procedure.model';
import { MpProcedureTypeFactory } from 'src/app/core/services/marche-public/type-procedure.model';
import { map, shareReplay } from 'rxjs/operators';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: IMpProcedureType = new MpProcedureType();
  @Input() typeId = null;
  dependancies = {
    types: []
  };

  dependanciesLoading = {
    types: false
  };

  constructor(
    public helper2: Helper,
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new MpProcedureTypeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IMpProcedureType) {
    let type_id = item.type_id ? item.type_id : this.typeId;

    return this.formBuilder.group({
      // 'description': [item.description, Validators.required],
      'type_id': [type_id],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

  // public getTypes(): void {
  //   if(this.dependancies.type && this.dependancies.type.length) {
  //     return;
  //   }
  //   this.dependanciesLoading.type = true;
  //   const service = new MpProcedureTypeFactory();
  //   service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
  //     shareReplay(1),
  //     map(data => data.data)
  //   ).subscribe((type: any) => {
  //     this.dependancies.type = type;
  //     this.dependanciesLoading.type = false;
  //   });
  // }
}
