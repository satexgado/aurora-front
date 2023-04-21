import { ChartType, ValeurEnum } from './../../../chart-enumeration';
import { DashboardService } from './../../dashboard.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { QualiteEnum } from '../../../chart-enumeration';
import { ChartFormData } from '../../../chart-interface';
import { BehaviorSubject } from 'rxjs';
import { ChooseStateComponent } from 'src/app/modules/chart-shared/choose-state/choose-state.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SavedState } from 'src/app/core/models/saved-state.model';
import { decycle } from 'src/app/shared/helperfonction';
import { SavedStateFactory } from 'src/app/core/services/saved-state.factory';


@Component({
  selector: 'app-choosing',
  templateUrl: './choosing.component.html',
  styleUrls: ['./choosing.component.css']
})
export class ChoosingComponent implements OnInit {

  single = {
    singleSelection: true,
    labelKey: 'libelle',
    enableSearchFilter: true,
    disabled: false,
    tagToBody: false
  };

  multiParameter2 = {
    singleSelection: false,
    selectAllText: 'Tout selectionner',
    unSelectAllText: 'Tout deselectionner',
    itemsShowLimit: 5,
    labelKey: 'libelle',
    enableSearchFilter: true,
    tagToBody: false
  };

  qualiteEnum = QualiteEnum;
  qualiteSelect = [
    {id: QualiteEnum.annee, libelle: 'Année'},
    {id: QualiteEnum.mois, libelle: 'Mois'},
    {id: QualiteEnum.nature, libelle: 'Nature'},
    // {id: QualiteEnum.service, libelle: 'Service'},
    // {id: QualiteEnum.fournisseur, libelle: 'Fournisseur'},
    // {id: QualiteEnum.partenaire, libelle: 'Partenaire'},
    {id: QualiteEnum.statut, libelle: 'Statut'},
    {id: QualiteEnum.type, libelle: 'Type'},
    {id: QualiteEnum.urgence, libelle: 'Urgence'},
    {id: QualiteEnum.valeur, libelle: 'Valeur'},
  ];

  valeurEnum = ValeurEnum;

  valeurSelect = [
    {id: ValeurEnum.nbcourrier, libelle: 'Nombre de courriers'},
  ];

  chartSelectItems = [
    {id: ChartType.bar, libelle: '', icon_class: "fal fa-chart-bar fa-lg m-2"},
    {id: ChartType.line, libelle: '', icon_class: "fal fa-chart-line fa-lg m-2"},
    {id: ChartType.scatter, libelle: '', icon_class: "fal fa-chart-scatter fa-lg m-2"},
  ];

  monthSelectItems = [
    {id: 1, libelle: 'Janvier'},
    {id: 2, libelle: 'Février'},
    {id: 3, libelle: 'Mars'},
    {id: 4, libelle: 'Avril'},
    {id: 5, libelle: 'Mai'},
    {id: 6, libelle: 'Juin'},
    {id: 7, libelle: 'Juillet'},
    {id: 8, libelle: 'Aout'},
    {id: 9, libelle: 'Septembre'},
    {id: 10, libelle: 'Octobre'},
    {id: 11, libelle: 'Novembre'},
    {id: 12, libelle: 'Decembre'},
  ];

  configForm: FormGroup;
  chartType = ChartType;
  @Output() chartSelect: EventEmitter<any> = new EventEmitter();
  @Input() externe = 1;

  constructor(private formbuilder: FormBuilder, private service: DashboardService,protected modalService: NgbModal) { }

  ngOnInit() {
    const formData = this.service.chartFormData;
    if(formData) {
      this.setFormData(formData);
    } else {
      this.createForm();
    }
  }

  createForm() {
    this.configForm = this.formbuilder.group({
      valeur: new FormControl(ValeurEnum.nbcourrier,Validators.required),
      qualite: new FormControl(QualiteEnum.annee,Validators.required),
      chartType: new FormControl(ChartType.bar,Validators.required),
      datasets: this.formbuilder.array([this.createDatasetsArray()])
    })
  }

  setFormData(formData: ChartFormData) {

    const datasetFormArray = this.formbuilder.array(formData.datasets.map(dataset => {


        const filtersGrp = this.formbuilder.array(dataset.filters.map(filter => {
          const filterGrp = this.formbuilder.group({
            type: [filter.type, Validators.required],
            value: [filter.value, Validators.required]
          });
          return filterGrp;
        }));

        const datasetGrp = this.formbuilder.group({
          libelle: new FormControl(dataset.libelle),
          couleur: new FormControl(dataset.couleur,Validators.required),
          chartType: new FormControl(dataset.chartType,Validators.required),
          filters: filtersGrp
        });

        return datasetGrp ;
    }));

    this.configForm = this.formbuilder.group({
      valeur: new FormControl(formData.valeur,Validators.required),
      qualite: new FormControl(formData.qualite,Validators.required),
      chartType: new FormControl(formData.chartType,Validators.required),
      datasets: datasetFormArray
    });

  }

  createDatasetsArray() {
    return this.formbuilder.group({
      libelle: null,
      couleur: ['#244ec9', Validators.required],
      chartType: [ChartType.bar, Validators.required],
      filters: new FormArray([])
    });
  }

  createFilterArray() {
    return this.formbuilder.group({
      type: ['annees', Validators.required],
      value: [null, Validators.required]
    })
  }

  getDatasets(form) {
    return form.controls.datasets.controls;
  }

  getFilters(form) {
    return form.controls.filters.controls;
  }

  addDataset() {
    const datasetsControl = this.configForm.get('datasets') as FormArray;
    datasetsControl.push(this.createDatasetsArray());
  }

  removeDataset(index: number) {
    const datasetsControl = <FormArray>this.configForm.get('datasets');
    datasetsControl.removeAt(index);
  }

  addFilter(i) {
    const datasetsControl = this.configForm.get('datasets') as FormArray;
    const filtersControl = datasetsControl.at(i).get('filters') as FormArray;
    filtersControl.push(this.createFilterArray());
  }

  reset(form, filtersIndex: number) {
    const control = form.get('filters').get([filtersIndex]).get('value') as FormControl
   control.setValue(null);
  }

  changed(e){
    console.log(e);
    // event comes as parameter, you'll have to find selectedData manually
    // by using e.target.data
}

  removeFilter(form, filtersIndex: number) {
    form.get('filters').removeAt(filtersIndex);
  }

  shouldDisableSubmit()
  {
    return  this.configForm.invalid;
  }

  onChartSelected() {
    this.service.chartFormData  = JSON.parse(JSON.stringify(this.configForm.value));
    this.chartSelect.emit(this.configForm.value);
  }

  onOpenStateModal()
  {
    const modalRef = this.modalService.open(ChooseStateComponent,{ size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseStateComponent;
    instance.canAddItem = true;

    instance.dataSource$ = this.externe ? this.service.allSavedStateEntrants$ : this.service.allSavedStateInternes$;
    instance.formLibelle = '';
    instance.title = 'Sauvegarder les parametres';
    instance.itemCreated.subscribe(
      (data: {libelle: string})=> {
        let savedState = new SavedState();
        savedState.libelle = data.libelle;
        savedState.module = 'courrier entrant';
        savedState.state = JSON.stringify(decycle(this.configForm.value, undefined));
        const savedStateService = new SavedStateFactory();
        savedStateService.create(savedState).subscribe(
          (newState)=> {
            if(this.externe) {
              this.service.addSavedStateEntrant(newState);
            } else {
              this.service.addSavedStateInterne(newState);
            }
          }
        );

        instance.onCloseModal('saved');
    });

    instance.itemChoosen.subscribe(
      (data: SavedState)=> {
        this.service.chartFormData  = data.retroState;
        this.ngOnInit();
      }
    );

    instance.itemRemove.subscribe(
      (data: SavedState)=> {
        const savedStateService = new SavedStateFactory();
        savedStateService.delete(data.id).subscribe(
          ()=> {
            if(this.externe)  {
              this.service.removeSavedStateEntrant(data.id);
            } else {
              this.service.removeSavedStateInterne(data.id);
            }
          }
        );
      }
    )
  };
}
