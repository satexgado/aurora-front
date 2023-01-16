import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import { CrReaffectation, ICrReaffectation } from 'src/app/core/models/gestion-courrier/cr-reaffectation';
import { CrReaffectationFactory } from 'src/app/core/services/gestion-courrier/cr-reaffectation';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { CacheService } from 'src/app/shared/services';
import { of } from 'rxjs';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-edit-affectation',
  templateUrl: './affectation.component.html'
})
export class AffectationEditComponent extends BaseEditComponent  {
  heading = 'reaffectation';
  @Input() item: CrReaffectation = new CrReaffectation();
  protected readonly allCrStructures$ = this.cacheService.get(
    'allCrStructures',
    new StructureService().all(),
    1800000);

  allUsers$ = of([]);

  constructor(
    cdRef:ChangeDetectorRef,
    protected cacheService: CacheService,
    activeModal: NgbActiveModal)
  {
    super(new CrReaffectationFactory(),cdRef, activeModal);
  }

  ngOnInit() {

    this.allCrStructures$.subscribe();
    if(this.item.structure_id) {
      this.allUsers$ = new UserFactory().list(
        new QueryOptions([
          {or: true, filters:[new Filter('structure_id', this.item.structure_id, 'eq')]},
      ]).setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])
      ).pipe(
        shareReplay(1),
        map(data => data.data)
      )
    }
    super.ngOnInit();
    this.onChange();
  }

  onChange() {
    const structureControl = this.editForm.get('structure_id') as FormControl;
    structureControl.valueChanges.subscribe(
      (value)=>{
        this.allUsers$ = new UserFactory().list(
          new QueryOptions([
            {or: true, filters:[new Filter('structure_id', value, 'eq')]},
        ]).setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])
        ).pipe(
          shareReplay(1),
          map(data => data.data)
        )
      }
    )
  }

  createFormGroup(item: ICrReaffectation) {
    return this.formBuilder.group({
      'structure_id': [item.structure_id, Validators.required],
      'courrier_id': [item.courrier_id, Validators.required],
      'suivi_par': [item.suivi_par, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
