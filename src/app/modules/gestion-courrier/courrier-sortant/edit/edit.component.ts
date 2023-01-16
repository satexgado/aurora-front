import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import {  Validators } from '@angular/forms';
import { CrCourrierSortant, ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { CrCourrierSortantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-sortant';
import { CustomDateParserFormatter } from 'src/app/shared/custom-config/ngdatepicker.custom';
import { NgbDateToStringAdapter } from 'src/app/shared/components/custom-input/ngb-datetime/ngb-date-to-string-adapter';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditComponent as CrCoordonneeEditComponent } from 'src/app/express-courrier/coordonnee/edit/edit.component';
import { EditComponent as CrTypeEditComponent } from 'src/app/modules/gestion-courrier/type/edit/edit.component';
import { EditComponent as CrNatureEditComponent } from 'src/app/modules/gestion-courrier/nature/edit/edit.component';
import { EditComponent as CrUrgenceEditComponent } from 'src/app/modules/gestion-courrier/urgence/edit/edit.component';
import { EditComponent as CrStatutEditComponent } from 'src/app/modules/gestion-courrier/statut/edit/edit.component';
import { EditComponent as CrDossierEditComponent } from 'src/app/modules/gestion-courrier/dossier/edit/edit.component';

import { CacheService } from 'src/app/shared/services';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Observable } from 'rxjs';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import { ICrEtape } from 'src/app/core/models/gestion-courrier/cr-etape';
import { CrStatutFactory } from 'src/app/core/services/gestion-courrier/cr-statut';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { CrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { CrEtapeFactory } from 'src/app/core/services/gestion-courrier/cr-etape';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { Helper } from 'src/app/helpers/helper/helper';
import { CrDossierFactory } from 'src/app/core/services/gestion-courrier/cr-dossier';
import { CourrierValidator } from 'src/app/shared';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditComponent extends BaseEditComponent  {
  heading = 'courrier-sortant';
  @Input() item: CrCourrierSortant = new CrCourrierSortant();

  loadingData = false;
  etapes: ICrEtape[];
  etapesType: ICrEtape[] = [];
  schemaStep = false;

  dependancies = {
    coordonnees: [],
  };

  dependanciesLoading = {
    coordonnees: false,
  };

  public getCoordonnees(): void {
    if(this.dependancies.coordonnees && this.dependancies.coordonnees.length) {
      return;
    }
    this.dependanciesLoading.coordonnees = true;
    this.allCoordonnees$.subscribe((coordonnees: any) => {
      this.dependancies.coordonnees = coordonnees;
      this.dependanciesLoading.coordonnees = false;
    });
  }

   protected readonly allCoordonnees$ = this.cacheService.get(
    'allCoordonnees',
    new CrCoordonneeFactory().list(new QueryOptions().setSort([new Sort('libelle', 'ASC')])).pipe(
      shareReplay(1),
      map(data => data.data)
    ),
    1800000);

  protected readonly CoordonneeEditComponent = CrCoordonneeEditComponent;

  protected readonly allCrTypes$ = this.cacheService.get(
  'allCrTypes',
  new CrTypeFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  ),
  1800000);

  protected readonly CrTypeEditComponent = CrTypeEditComponent;

  protected readonly allCrStatuts$ = this.cacheService.get(
    'allCrStatuts',
    new CrStatutFactory().list().pipe(
      shareReplay(1),
      map(data => data.data)
    ),
    1800000);

  protected readonly CrStatutEditComponent = CrStatutEditComponent;

  protected readonly allCrNatures$ = this.cacheService.get(
    'allCrNatures',
    new CrNatureFactory().list().pipe(
      shareReplay(1),
      map(data => data.data)
    ),
    1800000);
  protected readonly CrNatureEditComponent = CrNatureEditComponent;

  protected readonly allCrUrgences$ = this.cacheService.get(
  'allCrUrgences',
  new CrUrgenceFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  ),
  1800000);

  protected readonly CrUrgenceEditComponent = CrUrgenceEditComponent;


  protected readonly allCrStructures$ = this.cacheService.get(
  'allCrStructures',
  new StructureService().all(),
  1800000);

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

  constructor(
    cdRef:ChangeDetectorRef,
    protected cacheService: CacheService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrCourrierSortantFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrCourrierSortant) {
    const courrier = item.courrier ? item.courrier : new CrCourrier();
    return this.formBuilder.group({
      'ampiliations': [item.ampiliations ? item.ampiliations : []],
      'destinataires': [item.destinataires ? item.destinataires : []],
      'courrier_id': [item.courrier_id],
      'action_depot': [item.action_depot],
      'courrier_entrant_id': [item.courrier_entrant_id],
      'dossier_id': [courrier.dossier_id],
      'objet': [courrier.objet, Validators.required],
      'date_envoie': [item.date_envoie, Validators.required],
      'date_redaction': [courrier.date_redaction, Validators.required],
      'commentaire': [courrier.commentaire],
      'statut_id': [courrier.statut_id, Validators.required],
      'nature_id': [courrier.nature_id, Validators.required],
      'numero': [courrier.numero, Validators.required, CourrierValidator.alreadyUsedNumeroValidator(courrier.numero)],
      'type_id': [courrier.type_id, Validators.required],
      'urgence_id': [courrier.urgence_id, Validators.required],
      'structure_id': [courrier.structure_id, Validators.required],
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
