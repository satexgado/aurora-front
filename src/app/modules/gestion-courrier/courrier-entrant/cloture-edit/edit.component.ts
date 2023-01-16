import { CrClotureFactory } from './../../../../core/services/gestion-courrier/cr-cloture';
import { CrCourrierFactory } from './../../../../core/services/gestion-courrier/cr-courrier';
import { CrCourrier, ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { Validators, FormControl } from '@angular/forms';
import { CacheService } from 'src/app/shared/services';
import { map, shareReplay } from 'rxjs/operators';
import { CustomDateParserFormatter } from 'src/app/shared/custom-config/ngdatepicker.custom';
import { NgbDateToStringAdapter } from 'src/app/shared/components/custom-input/ngb-datetime/ngb-date-to-string-adapter';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ClotureCourrierEditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: ICrCourrier= new CrCourrier;

  protected readonly allCrClotures$ = this.cacheService.get(
    'allCrClotures',
    new CrClotureFactory().list().pipe(
      shareReplay(1),
      map(data => data.data)
    ),
    1800000);

  constructor(
    cdRef:ChangeDetectorRef,
    protected cacheService: CacheService,
    activeModal: NgbActiveModal)
  {
    super(new CrCourrierFactory(),cdRef, activeModal);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm.get('date_cloture').markAsDirty();
    this.editForm.get('date_cloture').markAsTouched();
  }

  createFormGroup(item: ICrCourrier) {
    let date = item.date_cloture ? item.date_cloture : new Date();
    return this.formBuilder.group({
      'cloture_id': [item.cloture_id, Validators.required],
      'date_cloture': [date, Validators.required],
      'message_cloture': [item.message_cloture],
      'id': [item.id]
    });
  }

}
