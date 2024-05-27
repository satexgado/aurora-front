import { CacheService } from 'src/app/shared/services/cache.service';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, Validators } from '@angular/forms';
import { CrTache, CrTacheStatut, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { CustomDateParserFormatter } from 'src/app/shared/custom-config/ngdatepicker.custom';
import { NgbDateToStringAdapter } from 'src/app/shared/components/custom-input/ngb-datetime/ngb-date-to-string-adapter';
import { enumSelector } from 'src/app/shared/helperfonction';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';

@Component({
  selector: 'app-edit2',
  templateUrl: './edit2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class Edit2Component extends BaseEditComponent  {
  heading = 'tache';
  @Input() item: CrTache = new CrTache();
  @Input() courrier_id: number = null;
  @Input() relation: {
    name: string,
    id: number|any[]
  }
  @Input() userFilter: filterGrp[]=null;
  CrTacheStatut = CrTacheStatut;

  TacheStatutSelect = enumSelector(CrTacheStatut);

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    protected cacheService: CacheService,
    activeModal: NgbActiveModal)
  {
    super(new CrTacheFactory(),cdRef, activeModal);
    this.newItem.subscribe((data)=>this.item=data);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onChanges();
  }

  onChanges(): void {
    const responsablesController = this.editForm.get('responsables') as FormArray;
    const sub1 = responsablesController.valueChanges.subscribe(val => {
      const responsablesIdController = this.editForm.get('responsables_id');
      responsablesIdController.setValue(val.map((item)=>item.id));
      responsablesIdController.markAsDirty();
    });

  }
  createFormGroup(item: ICrTache) {
    const courrier_id = this.courrier_id ? this.courrier_id : item.courrier_id;
    const date_limit = item.date_limit ? item.date_limit : new Date();
    return this.formBuilder.group({
      'date_limit': [date_limit, Validators.required],
      'courrier_id': [courrier_id],
      'description': [item.description],
      'priorite': ['important'],
      'responsables': [item.responsables],
      'responsables_id': [item.responsables && item.responsables.length ? item.responsables.map((val)=>val.id): []],
      'user2': [null],
      'statut': [item.statut],
      'libelle': [item.libelle, Validators.required],
      'relation_name': [this.relation ? this.relation.name : null],
      'relation_id': [this.relation ? this.relation.id : null],
      'id': [item.id]
    });
  }
}
