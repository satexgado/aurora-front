import { CacheService } from './../../../../shared/services/cache.service';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import { CrEtape, ICrEtape } from 'src/app/core/models/gestion-courrier/cr-etape';
import { CrEtapeFactory } from 'src/app/core/services/gestion-courrier/cr-etape';
import { map, shareReplay } from 'rxjs/operators';
import { UserFactory } from 'src/app/core/services/user.factory';
import { IUser } from 'src/app/core/models/user';
import { EditComponent as CrStatutEditComponent } from 'src/app/modules/gestion-courrier/statut/edit/edit.component';
import { CrStatutFactory } from 'src/app/core/services/gestion-courrier/cr-statut';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Helper } from 'src/app/helpers/helper/helper';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'etape';
  @Input() item: CrEtape = new CrEtape();
  @Input() etape: number;

  dependancies = {
    structures: [],
    users: [],
  };

  dependanciesLoading = {
    structures: false,
    users: false
  };

  type_responsable$ = of([{id: 'personne', libelle: 'Personne'}, {id: 'structure', libelle: 'Structure'}]);

  protected readonly allCrStatuts$ = this.cacheService.get(
      'allCrStatuts',
      new CrStatutFactory().list().pipe(
        shareReplay(1),
        map(data => data.data)
      ),
      1800000);

  protected readonly CrStatutEditComponent = CrStatutEditComponent;


    protected readonly allUsers$ = new UserFactory().list().pipe(
      shareReplay(1),
      map(data => data.data as IUser[])
    );

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    protected cacheService: CacheService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrEtapeFactory(),cdRef, activeModal);
  }

  ngOnInit(): void {
      super.ngOnInit();
      this.change();
  }

  createFormGroup(item: ICrEtape) {
    return this.formBuilder.group({
      'responsable_id': [item.responsable_id, Validators.required],
      'structure_id': [item.structure_id],
      'duree': [item.duree, Validators.required],
      'etape': [item.etape, Validators.required],
      'structure': [item.structure ? [item.structure] : []],
      'responsable': [item.responsable ? [item.responsable] : [], Validators.required],
      'type_responsable': ['personne', Validators.required],
      'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

  change() {
   let responsable_control = this.editForm.get('responsable') as FormControl;
   let responsable_id_control = this.editForm.get('responsable_id') as FormControl;
   responsable_control.valueChanges.subscribe(
     (data)=> {
       responsable_id_control.markAsTouched();
       responsable_id_control.markAsDirty();
       if(data && data.length) {
         return responsable_id_control.setValue(
           data[0].id
         )
       }
       responsable_id_control.setValue(null);
     }
   );

   let structure_control = this.editForm.get('structure') as FormControl;
   let structure_id_control = this.editForm.get('structure_id') as FormControl;
   structure_control.valueChanges.subscribe(
     (data)=> {
       structure_id_control.markAsTouched();
       structure_id_control.markAsDirty();
       if(data && data.length) {
         return structure_id_control.setValue(
           data[0].id
         )
       }
       structure_id_control.setValue(null);
     }
   );

   let type_responsable_control = this.editForm.get('type_responsable') as FormControl;
   type_responsable_control.valueChanges.subscribe(
     (data)=> {
       if(data == 'personne') {
        structure_control.clearValidators();
        structure_id_control.clearValidators();

        responsable_control.setValidators([Validators.required]);
        responsable_id_control.setValidators([Validators.required]);
       } else {
        responsable_control.clearValidators();
        responsable_id_control.clearValidators();

        structure_control.setValidators([Validators.required]);
        structure_id_control.setValidators([Validators.required]);
       }

        structure_control.updateValueAndValidity();
        structure_id_control.updateValueAndValidity();
        responsable_control.updateValueAndValidity();
        responsable_id_control.updateValueAndValidity();
     }
   )

   if(this.item.structure) {
    type_responsable_control.setValue('structure');
   }

   structure_control.markAsPristine();
   structure_id_control.markAsPristine();
   responsable_control.markAsPristine();
   responsable_id_control.markAsPristine();
   type_responsable_control.markAsPristine();
  }

  // TODO: Revoir la recuperation des structures
  public getStructures(): void {
    if(this.dependancies.structures && this.dependancies.structures.length) {
      return;
    }
    this.dependanciesLoading.structures = true;
    this.structureService.all(false).subscribe((structures: any) => {
      this.dependancies.structures = structures;
      this.dependanciesLoading.structures = false;
    });
  }

  public getUsers(): void {
    this.dependanciesLoading.users = true;
    this.allUsers$.subscribe((users: any) => {
      this.dependancies.users = users;
      this.dependanciesLoading.users = false;
    });
  }
}
