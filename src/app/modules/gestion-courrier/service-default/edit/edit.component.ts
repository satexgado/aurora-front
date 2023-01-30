import { Sort } from 'src/app/shared/models/query-options/sort.model';
import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { QueryOptions } from 'src/app/shared/models/query-options';
import { CacheService } from 'src/app/shared/services/cache.service';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { CrServiceDefault, ICrServiceDefault } from 'src/app/core/models/gestion-courrier/cr-service-default';
import { CrServiceDefaultFactory } from 'src/app/core/services/gestion-courrier/cr-service-default';
import { map, shareReplay } from 'rxjs/operators';
import { UserFactory } from 'src/app/core/services/user.factory';
import { IUser } from 'src/app/core/models/user';
import { EditComponent as CrStatutEditComponent } from 'src/app/modules/gestion-courrier/statut/edit/edit.component';
import { CrStatutFactory } from 'src/app/core/services/gestion-courrier/cr-statut';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Helper } from 'src/app/helpers/helper/helper';
import { of } from 'rxjs';
import { StructureValidator } from 'src/app/shared';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'service-default';
  @Input() item: CrServiceDefault = new CrServiceDefault();
  @Input() servicedefault: number;

  multiParameter2 = {
    singleSelection: false,
    selectAllText: 'Tout selectionner',
    unSelectAllText: 'Tout deselectionner',
    itemsShowLimit: 5,
    labelKey: 'libelle',
    enableSearchFilter: true,
    tagToBody: false
  };

  dependancies = {
    structures: [],
    users: [],
  };

  dependanciesLoading = {
    structures: false,
    users: false
  };

  allUsers$ = of([]);

  type_responsable$ = of([{id: 'personne', libelle: 'Personne'}, {id: 'structure', libelle: 'Structure'}]);



    // protected readonly allUsers$ = new UserFactory().list().pipe(
    //   shareReplay(1),
    //   map(data => data.data as IUser[])
    // );

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    protected cacheService: CacheService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrServiceDefaultFactory(),cdRef, activeModal);
  }

  ngOnInit(): void {
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
      this.change();
  }

  createFormGroup(item: ICrServiceDefault) {
    return this.formBuilder.group({
      // 'responsable_id': [item.responsable_id, Validators.required],
      'structure_id': [item.structure_id, Validators.required, StructureValidator.alreadyDefaultValidator(''+item.structure_id)],
      'structure': [item.structure ? [item.structure] : [], Validators.required],
      'users_id': [item.users && item.users.length ? item.users.map((element)=>element.id) : [], Validators.required],
      'users': [item.users ? item.users : [], Validators.required],
      'id': [item.id]
    });
  }

  change() {
  //  let responsable_control = this.editForm.get('responsable') as FormControl;
  //  let responsable_id_control = this.editForm.get('responsable_id') as FormControl;
  //  responsable_control.valueChanges.subscribe(
  //    (data)=> {
  //      responsable_id_control.markAsTouched();
  //      responsable_id_control.markAsDirty();
  //      if(data && data.length) {
  //        return responsable_id_control.setValue(
  //          data[0].id
  //        )
  //      }
  //      responsable_id_control.setValue(null);
  //    }
  //  );

   let users_control = this.editForm.get('users') as FormControl;
   let users_id_control = this.editForm.get('users_id') as FormControl;
   let structure_control = this.editForm.get('structure') as FormControl;
   let structure_id_control = this.editForm.get('structure_id') as FormControl;


   users_control.valueChanges.subscribe(
    (data)=> {
      users_id_control.markAsTouched();
      users_id_control.markAsDirty();

      if(data && data.length) {
        return users_id_control.setValue(
          data.map((element) => {
            return element.id;
          })
        );
      }

      users_id_control.setValue([]);
    }
  );

   structure_control.valueChanges.subscribe(
     (data)=> {
       structure_id_control.markAsTouched();
       structure_id_control.markAsDirty();
       users_control.setValue([]);
       if(data && data.length) {
         return structure_id_control.setValue(
           data[0].id
         )
       }
       structure_id_control.setValue(null);
     }
   );

   structure_id_control.valueChanges.subscribe(
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



   users_control.markAsPristine();
   users_id_control.markAsPristine();
   structure_control.markAsPristine();
   structure_id_control.markAsPristine();
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
