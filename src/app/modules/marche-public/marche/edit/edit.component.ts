import { MpMarcheTypeFactory } from 'src/app/core/services/marche-public/type-marche.model';
import { MpMarcheFactory } from 'src/app/core/services/marche-public/marche.model';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import { IMpMarche, MpMarche } from 'src/app/core/models/marche-public/marche.model';
import { shareReplay, map } from 'rxjs/operators';
import { MpProcedureTypeFactory } from 'src/app/core/services/marche-public/type-procedure.model';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { Helper } from 'src/app/helpers/helper/helper';
import { Observable } from 'rxjs';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { EditComponent as CrCoordonneeEditComponent } from 'src/app/express-courrier/coordonnee/edit/edit.component';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: IMpMarche = new MpMarche();

  single = {
    singleSelection: true,
    labelKey: 'libelle',
    enableSearchFilter: true,
    disabled: false,
    groupBy: 'titleParent'
  };

  dependancies = {
    type_procedures: [],
    structures: [],
    type_marches: [],
  };

  dependanciesLoading = {
    type_procedures: false,
    structures: false,
    type_marches: false,
  };

  protected readonly allMarcheTypes$ = new MpMarcheTypeFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  );

  protected readonly allProcedureTypes$ = new MpProcedureTypeFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  );

  protected readonly allCrStructures$ = new StructureService().all();


  allCoordonnees$: Observable<any[]>;
  protected readonly CoordonneeEditComponent = CrCoordonneeEditComponent;
  allCoordonnees: ICrCoordonnee[];

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new MpMarcheFactory(),cdRef, activeModal);
  }

  ngOnInit(): void {
    this.allCoordonnees$ = new CrCoordonneeFactory().list().pipe(
      shareReplay(1),
      map(data => {
        let select = [{
          id: null,
          libelle: 'Selectionnez'
        }];
        return [select, ...data.data]
      })
    );

    this.allCoordonnees$.subscribe(
      (data) => {
        this.allCoordonnees = data;
      }
    )

      super.ngOnInit();
      this.onChangeSomething();
      this.allMarcheTypes$.subscribe();
      this.allProcedureTypes$.subscribe();
      this.allCrStructures$.subscribe();
  }

  createFormGroup(item: IMpMarche) {
    return this.formBuilder.group({
      // 'description': [item.description, Validators.required],
      'service_contractant_id': [item.service_contractant_id, Validators.required],
      'type_marche_id': [item.type_marche_id, Validators.required],
      'type_procedure_id': [item.type_procedure_id, Validators.required],
      'service_contractant': [item.service_contractant, Validators.required],
      'type_marche': [item.type_marche, Validators.required],
      'type_procedure': [item.type_procedure, Validators.required],
      'libelle': [item.libelle, Validators.required],
      // 'fournisseur_id': [item.fournisseur_id],
      'cout': [item.cout],
      'id': [item.id]
    });
  }

  getCoordonnee(objetId: number): ICrCoordonnee {
    if(!this.allCoordonnees) {
      return null;
    }
    const filter = this.allCoordonnees.filter(element=> element.id == objetId);
    return  filter[0];
  }


  onChangeSomething() {
    let type_procedure_control = this.editForm.get('type_procedure') as FormControl;
    let type_marche_control = this.editForm.get('type_marche') as FormControl;
    let service_contractant_control = this.editForm.get('service_contractant') as FormControl;

    let type_procedure_id_control = this.editForm.get('type_procedure_id') as FormControl;
    let type_marche_id_control = this.editForm.get('type_marche_id') as FormControl;
    let service_contractant_id_control = this.editForm.get('service_contractant_id') as FormControl;

    type_marche_control.valueChanges.subscribe(
      (data)=> {
        if(data && data[0] && data[0].id) {
          type_marche_id_control.setValue(data[0].id);
        } else {
          type_marche_id_control.setValue(null);
        }

        type_marche_id_control.markAsTouched();
        type_marche_id_control.markAsDirty();
      }
    )

    type_procedure_control.valueChanges.subscribe(
      (data)=> {
        if(data && data[0] && data[0].id) {
          type_procedure_id_control.setValue(data[0].id);
        } else {
          type_procedure_id_control.setValue(null);
        }

        type_procedure_id_control.markAsTouched();
        type_procedure_id_control.markAsDirty();
      }
    )

    service_contractant_control.valueChanges.subscribe(
      (data)=> {
        if(data && data[0] && data[0].id) {
          service_contractant_id_control.setValue(data[0].id);
        } else {
          service_contractant_id_control.setValue(null);
        }

        service_contractant_id_control.markAsTouched();
        service_contractant_id_control.markAsDirty();
      }
    )
  }

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

  public getTypeProcedures(): void {
    if(this.dependancies.type_procedures && this.dependancies.type_procedures.length) {
      return;
    }
    this.dependanciesLoading.type_procedures = true;
    const service = new MpProcedureTypeFactory();
    service.list(new QueryOptions(
      [
        {or: true, filters:[new Filter('no_child', 1, 'eq')]},
      ]
    ).setSort([new Sort('libelle','ASC')]).setIncludes(['mp_type_procedure'])).pipe(
      shareReplay(1),
      map(data => data.data)
    ).subscribe((type_procedures: any) => {
      this.dependancies.type_procedures = type_procedures;
      this.dependanciesLoading.type_procedures = false;
    });
  }

  public getTypeMarches(): void {
    if(this.dependancies.type_marches && this.dependancies.type_marches.length) {
      return;
    }
    this.dependanciesLoading.type_marches = true;
    const service = new MpMarcheTypeFactory();
    service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
      shareReplay(1),
      map(data => data.data)
    ).subscribe((type_marches: any) => {
      this.dependancies.type_marches = type_marches;
      this.dependanciesLoading.type_marches = false;
    });
  }

}
