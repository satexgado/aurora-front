import { ICrProvenance } from './../../../../core/models/gestion-courrier/cr-provenance';
import { CrProvenanceFactory } from './../../../../core/services/gestion-courrier/cr-provenance';
import { CustomDateParserFormatter } from 'src/app/shared/custom-config/ngdatepicker.custom';
import { NgbDateToStringAdapter } from 'src/app/shared/components/custom-input/ngb-datetime/ngb-date-to-string-adapter';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import { shareReplay, map, switchMap } from 'rxjs/operators';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { CacheService } from 'src/app/shared/services/cache.service';
import { Component, Input, ChangeDetectorRef, ViewChild} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, Validators, FormControl, FormGroup } from '@angular/forms';
import { CrCourrierEntrant, ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { CrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { Observable, of } from 'rxjs';
import { EditComponent as CrCoordonneeEditComponent } from 'src/app/express-courrier/coordonnee/edit/edit.component';
import { EditComponent as CrTypeEditComponent } from 'src/app/modules/gestion-courrier/type/edit/edit.component';
import { EditComponent as CrNatureEditComponent } from 'src/app/modules/gestion-courrier/nature/edit/edit.component';
import { EditComponent as CrUrgenceEditComponent } from 'src/app/modules/gestion-courrier/urgence/edit/edit.component';
import { EditComponent as CrStatutEditComponent } from 'src/app/modules/gestion-courrier/statut/edit/edit.component';
import { EditComponent as CrDossierEditComponent } from 'src/app/modules/gestion-courrier/dossier/edit/edit.component';

import { ICrEtape } from 'src/app/core/models/gestion-courrier/cr-etape';
import { CrEtapeFactory } from 'src/app/core/services/gestion-courrier/cr-etape';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CrStatutFactory } from 'src/app/core/services/gestion-courrier/cr-statut';
import { UserFactory } from 'src/app/core/services/user.factory';
import { ICrNature } from 'src/app/core/models/gestion-courrier/cr-nature';
import { IJsonFormControl } from 'src/app/core/models/json-form/json-form-control';
import { CrDossierFactory } from 'src/app/core/services/gestion-courrier/cr-dossier';
import { requiredFileType } from 'src/app/shared/upload-file.validator';
import { CourrierValidator } from 'src/app/shared';
import { JsonForm2Component, JsonFormData } from '../../json-form/form/json-form2.component';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditComponent extends BaseEditComponent  {
  heading = 'courrier-entrant';
  @Input() item: CrCourrierEntrant = new CrCourrierEntrant();
  @ViewChild(JsonForm2Component) extraFormComp;
  @Input() externe = null;

  // protected readonly allCoordonnees$ = this.cacheService.get(
  //   'allCoordonnees',
  //   new CrCoordonneeFactory().list().pipe(
  //     shareReplay(1),
  //     map(data => data.data)
  //   ),
  //   180000);

  loadingData = false;
  etapes: ICrEtape[];
  etapesType: ICrEtape[] = [];
  schemaStep = false;
  supplementaryField: JsonFormData;

  protected readonly allCrTypes$ = this.cacheService.get(
  'allCrTypes',
  new CrTypeFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  ),
  180000);

  protected readonly CrTypeEditComponent = CrTypeEditComponent;

  protected readonly allCrStatuts$ = this.cacheService.get(
    'allCrStatuts',
    new CrStatutFactory().list().pipe(
      shareReplay(1),
      map(data => data.data)
    ),
    180000);

  protected readonly CrStatutEditComponent = CrStatutEditComponent;

  protected readonly allCrNatures$ = this.cacheService.get(
  'allCrNatures',
  new CrNatureFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  ),
  180000);

  protected readonly CrNatureEditComponent = CrNatureEditComponent;

  protected readonly allCrUrgences$ = this.cacheService.get(
  'allCrUrgences',
  new CrUrgenceFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  ),
  180000);

  protected readonly allCrProvenances$ = this.cacheService.get(
    'allCrProvenances',
    new CrProvenanceFactory().list().pipe(
      shareReplay(1),
      map(data => data.data)
    ),
    180000);

  protected readonly CrUrgenceEditComponent = CrUrgenceEditComponent;


  protected readonly allCrStructures$ = this.cacheService.get(
  'allCrStructures',
  new StructureService().allWEmployee(),
  180000);


  protected readonly CrDossierEditComponent = CrDossierEditComponent;
  protected readonly allCrDossiers$ = new CrDossierFactory().list().pipe(
    shareReplay(1),
    map(data => {
      let select = [{
        id: null,
        libelle: 'Selectionnez un dossier'
      }];
      return [select, ...data.data]
    })
  );

  allUsers$ = of([]);
  allExpediteurs$ = of([]);
  allNatures: ICrNature[];


  allCoordonnees$: Observable<ICrCoordonnee[]>;
  protected readonly CoordonneeEditComponent = CrCoordonneeEditComponent;
  allCoordonnees: ICrCoordonnee[];
  allProvenances: ICrProvenance[];

  constructor(
    cdRef:ChangeDetectorRef,
    protected cacheService: CacheService,
    activeModal: NgbActiveModal)
  {
    super(new CrCourrierEntrantFactory(),cdRef, activeModal);
  }

  get allfilteredProvenance$() {
    if(this.externe !== null) {
      return this.allCrProvenances$.pipe(
        map(data=> data.filter(element=> element.externe == this.externe))
      )
    }
    return this.allCrProvenances$;
  }

  ngOnInit() {

    this.allCoordonnees$ = new CrCoordonneeFactory().list().pipe(
      shareReplay(1),
      map(data => data.data)
    );

    this.allCoordonnees$.subscribe(
      (data) => {
        this.allCoordonnees = data;
      }
    )
    this.allCrProvenances$.subscribe(
      (data) => {
        this.allProvenances = data;
      }
    )

    this.allCrNatures$.subscribe(
      (data)=> {
        this.allNatures = data;
      }
    )

    this.allCrStructures$.subscribe(
      (data)=> {
        if(this.item.courrier?.structure_id) {
          const filtered = data.filter(element=> element.id == this.item.courrier?.structure_id);

          if(!filtered[0]._employes.length) {
            this.allUsers$ = of([]);
            return;
         }

         this.allUsers$ = of(
          Array.from(filtered[0]._employes.reduce((m, t) => m.set(t.id, t), new Map()).values())
         );
        } 
      }
    );
    // if(this.item.courrier?.structure_id) {
    //   this.allUsers$ = new UserFactory().list(
    //     new QueryOptions([
    //       {or: true, filters:[new Filter('structure_id', this.item.courrier?.structure_id, 'eq')]},
    //   ]).setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])
    //   ).pipe(
    //     shareReplay(1),
    //     map(data => data.data)
    //   )
    // }

    this.allCrDossiers$.subscribe();

    if(this.item.provenance) {
      if(this.item.provenance.externe) {
        this.allExpediteurs$ = this.allCoordonnees$;
      } else {
        this.allExpediteurs$ = this.allCrStructures$;
      }
    }

    super.ngOnInit();
    this.onChange();
    this.onImageChange();
    if(!this.isUpdating) {
      this.onUrgengeChange()
    }
  }

  onChange() {
    const structureControl = this.editForm.get('structure_id') as FormControl;
    structureControl.valueChanges.subscribe(
      (value)=>{
        this.allCrStructures$.subscribe(
          (data)=> {
              const filtered = data.filter(element=> element.id == value);

              if(!filtered[0]._employes.length) {
                this.allUsers$ = of([]);
                return;
             }

             this.allUsers$ = of(
              Array.from(filtered[0]._employes.reduce((m, t) => m.set(t.id, t), new Map()).values())
             );
          }
        );
      }
    )

    const provenanceControl = this.editForm.get('provenance_id') as FormControl;
    const provenanceTypeControl = this.editForm.get('expediteur_type') as FormControl;

    provenanceControl.valueChanges.subscribe(
      (data)=>{
        let provenance = this.getProvenance(data);
        if(provenance.externe) {
          this.allExpediteurs$ = this.allCoordonnees$;
          provenanceTypeControl.setValue("App\\Models\\Courrier\\CrCoordonnee");
        } else {
          this.allExpediteurs$ = this.allCrStructures$;
          provenanceTypeControl.setValue("App\\Models\\Structure");
        }

        provenanceTypeControl.markAsDirty();
        provenanceTypeControl.markAsTouched();
      }
    )

    const natureControl = this.editForm.get('nature_id') as FormControl;
    natureControl.valueChanges.subscribe(
      (val)=> {
       let filtered =  this.getNature(val);

       if(filtered && filtered.form_fields && filtered.form_fields.length) {

        return this.supplementaryField = {controls: filtered.form_fields};

       }
       this.supplementaryField = null;
      }
    )
  }

  getNature(objetId: number): ICrNature {
    if(!this.allNatures) {
      return null;
    }
    const filter = this.allNatures.filter(element=> element.id == objetId);
    return  filter[0];
  }

  getCoordonnee(objetId: number): ICrCoordonnee {
    if(!this.allCoordonnees) {
      return null;
    }
    const filter = this.allCoordonnees.filter(element=> element.id == objetId);
    return  filter[0];
  }

  getProvenance(objetId: number): ICrProvenance {
    if(!this.allProvenances) {
      return null;
    }
    const filter = this.allProvenances.filter(element=> element.id == objetId);
    return  filter[0];
  }

  onImageChange() {
    // const control = this.editForm.get('image');
    // let sub = this.editForm.get('image').valueChanges
    //   .subscribe(type => {
    //     control.markAsDirty();
    //   });
  }

  onUrgengeChange() {
    const control = this.editForm.get('urgence_id');
    const datecontrol = this.editForm.get('date_limit');
    let sub = this.editForm.get('urgence_id').valueChanges
      .subscribe(urgence_id => {
        if(datecontrol.dirty) return;

        this.allCrUrgences$.subscribe(
          (urgences)=> {
            const filtered = urgences.filter(element=> element.id == urgence_id);
            let moyenne = new Date();
            datecontrol.setValue( moyenne.setDate(moyenne.getDate()+filtered[0].delai));
          }
        )
    });
  }

  createFormGroup(item: ICrCourrierEntrant) {
    const courrier = item.courrier ? item.courrier : new CrCourrier();
    if(courrier.additional_jsonFormData) {
      this.supplementaryField = courrier.additional_jsonFormData;
    }
    return this.formBuilder.group({
      'expediteur_id': [item.expediteur_id, Validators.required],
      'expediteur_type': [item.expediteur_type, Validators.required],
      'responsable_id': [1, Validators.required],
      'provenance_id': [item.provenance_id, Validators.required],
      'date_arrive': [item.date_arrive, Validators.required],
      'courrier_id': [item.courrier_id],
      'dossier_id': [courrier.dossier_id],
      'objet': [courrier.objet, Validators.required],
      'date_redaction': [courrier.date_redaction, Validators.required],
      'date_limit': [courrier.date_limit, Validators.required],
      'commentaire': [courrier.commentaire],
      'valider': [1, Validators.required],
      'statut_id': [courrier.statut_id, Validators.required],
      'nature_id': [courrier.nature_id, Validators.required],
      'numero': [courrier.numero, Validators.required, CourrierValidator.alreadyUsedNumeroValidator(courrier.numero)],
      'type_id': [courrier.type_id, Validators.required],
      'urgence_id': [courrier.urgence_id, Validators.required],
      'structure_id': [courrier.structure_id, Validators.required],
      'suivi_par': [courrier.suivi_par, Validators.required],
      // 'image':['', [Validators.required, requiredFileType(['pdf','gif','jpeg', 'jpg'])]],
      'id': [item.id]
    });
  }

  loadEtape(): void {
    this.schemaStep = true;
    this.loadingData = true;
    const service = new CrEtapeFactory();
    const typeId = this.editForm.get('type_id').value;
    service.list(new QueryOptions().setIncludes(['responsable','structure']).setSort([new Sort('libelle', 'ASC')]) ).pipe(
      switchMap(
        (data)=> {
          this.etapes = data.data;
          return service.list(new QueryOptions().setFilterGroups(
            [
              {or: true, filters:[new Filter('parent_cr_type_id', typeId, 'eq')]},
            ]
          ).setIncludes(['responsable','structure']).setSort([new Sort('orderlyWay', 'desc')]))
        }
      )
    ).subscribe(
      (data)=> {
        data.data.forEach( (item, index) => {
          this.onDelete(item.id);
        });
        this.etapesType = data.data;
        this.loadingData = false;
      }
    );
}

doCreateItem(closeModalAfter: boolean = true) {
  this.editForm.addControl(
    'etapes', this.formBuilder.array(this.etapesType)
  );
  super.doCreateItem(closeModalAfter);
}

onSubmit(closeModalAfter?: boolean): void {
  if(this.extraFormComp){
    this.editForm.addControl(
      'additional_field', new FormControl(this.extraFormComp.getVal())
    );
    let control = this.editForm.get('additional_field');
    control.markAsDirty();
    control.markAsTouched();
  } else {
    this.editForm.removeControl(
      'additional_field'
    );
  }
  super.onSubmit(closeModalAfter);
}

shouldDisableSubmit() {
  let bool = false;
  if(this.extraFormComp) {
   bool = this.extraFormComp.shouldDisableSubmit();
  }

  return (super.shouldDisableSubmit() || bool);
}

onDelete(id: number) {
  let index = this.etapes.findIndex(d => d.id === id); //find index in your array
  this.etapes.splice(index, 1);//remove element from array
}

drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }
}
}
