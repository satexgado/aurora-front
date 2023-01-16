import { CacheService } from 'src/app/shared/services/cache.service';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { CrTache, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { CustomDateParserFormatter } from 'src/app/shared/custom-config/ngdatepicker.custom';
import { NgbDateToStringAdapter } from 'src/app/shared/components/custom-input/ngb-datetime/ngb-date-to-string-adapter';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditComponent extends BaseEditComponent  {
  heading = 'tache';
  @Input() item: CrTache = new CrTache();
  @Input() courrier_id: number;

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    protected cacheService: CacheService,
    activeModal: NgbActiveModal)
  {
    super(new CrTacheFactory(),cdRef, activeModal);
    this.newItem.subscribe((data)=>this.item=data);
  }

  createFormGroup(item: ICrTache) {
    const courrier_id = this.courrier_id ? this.courrier_id : item.courrier_id;
    const date_limit = item.date_limit ? item.date_limit : new Date();
    return this.formBuilder.group({
      'date_limit': [date_limit, Validators.required],
      // 'courrier_id': [courrier_id],
      'description': [item.description],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
