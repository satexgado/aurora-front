import { IHorloge, Horloge } from 'src/app/core/models/horloge.model';
import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormArray } from '@angular/forms';
import { CacheService } from 'src/app/shared/services';
import { HorlogeFactory } from 'src/app/core/services/horloge.factory';
import { TypeHorlogeEnum } from '../../../../core/models/horloge.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/shared/custom-config/ngdatepicker.custom';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditComponent extends BaseEditComponent implements OnInit  {
  heading = 'horloge';
  @Input() item: IHorloge = new Horloge();
  hoveredDate: NgbDate | null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  typeEnum = TypeHorlogeEnum;

  typeHorloge = [
    {
      id: TypeHorlogeEnum.periode,
      libelle: TypeHorlogeEnum.periode,
      // icon_class: "fal fa-school tx-second "
    },
    {
      id: TypeHorlogeEnum.annee,
      libelle: TypeHorlogeEnum.annee,
    },
    {
      id: TypeHorlogeEnum.mois,
      libelle: TypeHorlogeEnum.mois,
    },
    {
      id: TypeHorlogeEnum.jour,
      libelle: TypeHorlogeEnum.jour,
    },
    {
      id: TypeHorlogeEnum.heure,
      libelle: TypeHorlogeEnum.heure,
    }
  ];

  constructor(
    protected cacheService: CacheService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new HorlogeFactory(),cdRef, activeModal);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onChanges();
  }

  onChanges(): void {
    const typeController = this.editForm.get('type') as FormArray;
    const sub1 = typeController.valueChanges.subscribe(val => {
      const valeurController = this.editForm.get('valeur');
      const dateDebutControl =  this.editForm.get('date_debut');;
      const dateFinControl =  this.editForm.get('date_fin');;

      if(val == this.typeEnum.periode)
      {
        valeurController.setValue(0);
        valeurController.setValidators(null);
        dateDebutControl.setValidators([Validators.required]);
        dateFinControl.setValidators([Validators.required]);
      } else {
        dateDebutControl.setValidators(null);
        dateFinControl.setValidators(null);
        valeurController.setValue(1);
        valeurController.setValidators([Validators.required, Validators.min(1)]);
      }

      dateDebutControl.updateValueAndValidity();
      dateFinControl.updateValueAndValidity();
      valeurController.updateValueAndValidity();
    });

  }
  createFormGroup(item: IHorloge) {
    const date_debut = item.date_debut ?  item.date_debut : new Date();
    const date_fin = item.date_fin ?  item.date_fin : new Date();
    this.fromDate = new NgbDate(date_debut.getFullYear(),date_debut.getMonth()+1,date_debut.getDate()) ;
    this.toDate = new NgbDate(date_fin.getFullYear(),date_fin.getMonth()+1,date_fin.getDate()) ;

    return this.formBuilder.group({
      'date_debut': [item.date_debut, Validators.required],
      'date_fin': [item.date_fin, Validators.required],
      'valeur': [item.valeur],
      'type': [item.type, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      let date_debut = new Date(date.year, date.month-1, date.day);
      this.editForm.get('date_debut').setValue(date_debut);
      this.editForm.get('date_debut').markAsDirty();
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      let date_fin = new Date(date.year, date.month-1, date.day);
      this.editForm.get('date_fin').setValue(date_fin);
      this.editForm.get('date_fin').markAsDirty();
    } else {
      this.toDate = null;
      this.editForm.get('date_fin').setValue(null);
      this.fromDate = date;
      let date_debut = new Date(date.year, date.month-1, date.day);
      this.editForm.get('date_debut').setValue(date_debut);
      this.editForm.get('date_debut').markAsDirty();
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
