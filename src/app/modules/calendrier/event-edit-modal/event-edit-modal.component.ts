import { NgbDateToStringAdapter } from 'src/app/shared/components/custom-input/ngb-datetime/ngb-date-to-string-adapter';
import { RRuleToText } from './../event-utils';
import { DateValidators } from 'src/app/shared/date.validator';
// import { MatiereFactory } from 'src/app/core/services/matiere';
import { CalendrierEventFactory } from 'src/app/core/services/calendar/event.factory';
import { CalendrierEventTypeFactory } from 'src/app/core/services/calendar/event-type.factory';
import { ICalendrierEvent, CalendrierEvent } from 'src/app/core/models/calendar/event.model';
import { Component, Input, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbDate, NgbDateParserFormatter, NgbModal, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from 'src/app/shared/services';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { shareReplay, map, switchMap } from 'rxjs/operators';
import { IUser } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Frequency, RRule } from 'rrule';
import { shouldShowRequiredError as helper_SSRE, isValid as helper_isvalid, shouldDisableSubmit as helper_SDS} from 'src/app/shared/helperfonction'
// import { IPersonnel } from 'src/app/core/models/rh/personnel.model';
// import { IMatiere } from 'src/app/core/models/matiere';
// import { PersonnelFactory } from 'src/app/core/services/rh/personnel.factory';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';

@Component({
  selector: 'app-calendar-event-edit-modal',
  templateUrl: './event-edit-modal.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
  ],
})
export class CalendrierEventEditModalComponent extends BaseEditComponent implements OnInit, AfterViewInit {
  @Input() item: ICalendrierEvent = new CalendrierEvent();
  hideRepeter;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  allTypeCalendar$: Observable<any> = new CalendrierEventTypeFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  );
  allUser$;
  allUsers: IUser[];
  userSelect2Data$;
  is_loading_user;

  // allPersonnel$;
  // allPersonnels: IPersonnel[];
  // personnelSelect2Data$;
  // is_loading_personnel = true;

  // allMatiere$;
  // allMatieres: IMatiere[];
  // matiereSelect2Data$;
  // is_loading_matiere = true;

  rruleGroup: FormGroup;

shouldShowRequiredErrorRRuleGrp = (name)=> helper_SSRE(this.rruleGroup, name);
shouldDisableSubmitRRuleGrp = ()=> helper_SDS(this.rruleGroup);
isValidRRuleGrp = (name)=> helper_isvalid(this.rruleGroup, name);
open(content, event) {
  //correct a value change error
  event.srcElement.blur();
  event.preventDefault();
  // end of correction

  this.modalService.open(content);
  this.cdRef.detectChanges();
}

  frequencyEnum = Frequency;
  frequenceSelect = [
    {
      libelle: 'jour(s)',
      id: Frequency.DAILY
    },
    {
      libelle: 'semaine(s)',
      id: Frequency.WEEKLY
    },
    {
      libelle: 'mois',
      id: Frequency.MONTHLY
    },
    {
      libelle: 'an(s)',
      id: Frequency.YEARLY
    }
  ];
  weekdaySelect = [
    {
      text: 'Lundi',
      id: 0
    },
    {
      text: 'Mardi',
      id: 1
    },
    {
      text: 'Mercredi',
      id: 2
    },
    {
      text: 'Jeudi',
      id: 3
    },
    {
      text: 'Vendredi',
      id: 4
    },
    {
      text: 'Samedi',
      id: 5
    },
    {
      text: 'Dimanche',
      id: 6
    }
  ];
  weekdaySelect2 = of(this.weekdaySelect);
  setPosSelect = [
    {
      text: 'Premier',
      id: 1
    },
    {
      text: 'Deuxième',
      id: 2
    },
    {
      text: 'Troisième',
      id: 3
    },
    {
      text: 'Quatrième',
      id: 4
    },
    {
      text: 'Dernier',
      id: -1
    }
  ];
  setposSelect2= of(this.setPosSelect);
  _monthdatselectByMonth$ = new BehaviorSubject(Array(31).fill(0).map((x,i)=>i+1));
  get monthdatselectByMonth$() {
    return this._monthdatselectByMonth$.asObservable();
  }
  monthdaySelect = Array(31).fill(0).map((x,i)=>i+1);
  monthdaySelect2 = of(Array(31).fill(0).map((x,i)=>{
    i+=1;
    return {
      text: ''+i,
      id: i
    }
  }));
  monthSelect = [
    {
      text: 'Janvier',
      id: 1
    },
    {
      text: 'Fevrier',
      id: 2
    },
    {
      text: 'Mars',
      id: 3
    },
    {
      text: 'Avril',
      id: 4
    },
    {
      text: 'Mai',
      id: 5
    },
    {
      text: 'Juin',
      id: 6
    },
    {
      text: 'Juillet',
      id: 7
    },
    {
      text: 'Aout',
      id: 8
    },
    {
      text: 'Septembre',
      id: 9
    },
    {
      text: 'Octobre',
      id: 10
    },
    {
      text: 'Novembre',
      id: 11
    },
    {
      text: 'Decembre',
      id: 12
    }
  ];
  constructor(
    protected cdRef: ChangeDetectorRef,
    protected cacheService: CacheService,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    super(new CalendrierEventFactory(), cdRef, activeModal);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onChanges();
  }


  onChanges(): void {
    let control = this.editForm.get('type_id') as FormControl;
    control.valueChanges.subscribe(val => {
      this.cdRef.detectChanges();
    });

    let controlPersonnel = this.editForm.get('personnels') as FormControl;
    controlPersonnel.valueChanges.subscribe(val => {
      this.cdRef.detectChanges();
    });

    let controlMatiere = this.editForm.get('matieres') as FormControl;
    controlMatiere.valueChanges.subscribe(val => {
      this.cdRef.detectChanges();
    });

    let control4 = this.editForm.get('allDay') as FormControl;
    control4.valueChanges.subscribe(val => {
      this.cdRef.detectChanges();
      if(val) {
        const date_debut_ctr =this.editForm.get('date_debut');
        let debut = new Date(date_debut_ctr.value);
        if(debut) {
          debut.setHours(12,0);
          date_debut_ctr.setValue(debut);
        }

        const date_fin_ctr =this.editForm.get('date_fin');
        let fin = new Date(date_fin_ctr.value);
        if(fin) {
          fin.setHours(12,0);
          date_fin_ctr.setValue(fin);
        }

        date_debut_ctr.updateValueAndValidity();
        date_fin_ctr.updateValueAndValidity();
      }
    });

    let control6 = this.editForm.get('repeter') as FormControl;
    control6.valueChanges.subscribe(val => {
      this.cdRef.detectChanges();
    });

    let bymonthtypeCtr = this.rruleGroup.get('bymonthtype');
    bymonthtypeCtr.valueChanges.subscribe(
      val => {
        if(val == 'weekday') {
          this.rruleGroup.get('bymonthday').disable();

          this.rruleGroup.get('bysetpos').enable();
          this.rruleGroup.get('bysingleweekday').enable();
        } else {
          this.rruleGroup.get('bymonthday').enable();

          this.rruleGroup.get('bysetpos').disable();
          this.rruleGroup.get('bysingleweekday').disable();

        }
        this.rruleGroup.updateValueAndValidity();
      }
    );

    let freqCtr = this.rruleGroup.get('freq');
    freqCtr.valueChanges.subscribe(
      val => {
      this.cdRef.detectChanges();
      }
    )

    let dtstartCtrl = this.rruleGroup.get('dtstart');
    dtstartCtrl.valueChanges.subscribe(
      val => {
        this.cdRef.detectChanges();
        let untilCtrl = this.rruleGroup.get('until');

        let date1: Date = val;
        let date2: Date = untilCtrl.value;
        if(!(date1 instanceof Date)) {
          date1 = new Date(date1);
        }
        if(!(date2 instanceof Date)) {
          date2 = new Date(date2);
        }

        if ((date1 !== null && date2 !== null) && date1 > date2) {
          untilCtrl.setValue(date1);
          untilCtrl.updateValueAndValidity();
        }
      }
    )
    let untilCtrl = this.rruleGroup.get('until');
    untilCtrl.valueChanges.subscribe(
      val => {
        this.cdRef.detectChanges();
        let dtstartCtrl = this.rruleGroup.get('dtstart');

        let date1: Date = val;
        let date2: Date = dtstartCtrl.value;
        if(!(date1 instanceof Date)) {
          date1 = new Date(date1);
        }
        if(!(date2 instanceof Date)) {
          date2 = new Date(date2);
        }

        if ((date1 !== null && date2 !== null) && date1 < date2) {
          dtstartCtrl.setValue(date1);
          dtstartCtrl.updateValueAndValidity();
        }
      }
    )
  }

  ngAfterViewInit() {
    // this.onLoadMatieres();
    // this.onLoadPersonnels();
    // this.onLoadPersonnelsTestPurpose();
  }

  // onLoadPersonnels() {
  //   this.is_loading_personnel = true;
  //   const service = new PersonnelFactory();
  //   this.allPersonnel$ = this.cacheService.get('affectation-parent').pipe(
  //     switchMap((data: {relationName: string,relationId: number})=>{
  //       const queryOptions: QueryOptions = new QueryOptions(
  //         [
  //           {or: false, filters: [new Filter(`${data.relationName}_by_id`, data.relationId, 'eq')]}
  //         ],
  //       );
  //       queryOptions.includes = ['user', 'visi_masque_personnel', 'visi_poste', 'visi_matieres'];
  //       queryOptions.sort = [new Sort('nom_complet','ASC')];
  //       return service.list(queryOptions);
  //     })
  //   ).subscribe(data=> {
  //     const personnels_id = this.item.personnels ? this.item.personnels.map((element => element.id)) : [];
  //     const mappedData  = data.data.map((element: IPersonnel) => {
  //       const texte = `${element.libelle} (${element.title})`;
  //       const result = {id : element.id ,  text: texte, selected: false};
  //       if (personnels_id.includes(element.id)) {
  //         result.selected = true;
  //       }
  //       return result;
  //       });
  //     this.allPersonnels = data.data;
  //     this.is_loading_personnel = false;
  //     this.personnelSelect2Data$ = of(mappedData);
  //   });
  // }

  // onLoadPersonnelsTestPurpose(){
  //   this.is_loading_personnel = true;
  //   const service = new PersonnelFactory();
  //   const queryOptions: QueryOptions = new QueryOptions(
  //     [
  //       {or: false, filters: [new Filter(`etablissement_by_id`, 1, 'eq')]}
  //     ],
  //   );
  //   queryOptions.includes = ['user', 'visi_masque_personnel', 'visi_poste', 'visi_matieres'];
  //   queryOptions.sort = [new Sort('nom_complet','ASC')];
  //   this.allPersonnel$ = service.list(queryOptions).subscribe(data=> {
  //     const personnels_id = this.item.personnels ? this.item.personnels.map((element => element.id)) : [];
  //     const mappedData  = data.data.map((element: IPersonnel) => {
  //       const texte = `${element.libelle} (${element.title})`;
  //       const result = {id : element.id ,  text: texte, selected: false};
  //       if (personnels_id.includes(element.id)) {
  //         result.selected = true;
  //       }
  //       return result;
  //       });
  //     this.allPersonnels = data.data;
  //     this.is_loading_personnel = false;
  //     this.personnelSelect2Data$ = of(mappedData);
  //   });
  // }

  // onLoadMatieres() {
  //   this.is_loading_matiere = true;
  //   const service = new MatiereFactory();
  //   this.allMatiere$ = service.list(  new QueryOptions(
  //     ).setSort([new Sort('libelle_matiere','ASC')])
  //   )
  //   .subscribe(data=> {
  //     const matieres_id = this.item.matieres ? this.item.matieres.map((element => element.id)) : [];

  //     const mappedData  = data.data.map((element) => {
  //       const result = {id : element.id ,  text: element.libelle, selected: false};
  //       if (matieres_id.includes(element.id)) {
  //         result.selected = true;
  //       }
  //       return result;
  //       });
  //     this.allMatieres = data.data;
  //     this.is_loading_matiere = false;
  //     this.matiereSelect2Data$ = of(mappedData);
  //   });
  // }

  getRRuleText(rrule: RRule, allDay: boolean|number = true, hour = '00', minute= '00') {
    let dureetext = '';

    if(!allDay) {
      dureetext = ', debut '+ rrule.options.dtstart.getHours().toString().padStart(2, '0') + ':' + rrule.options.dtstart.getMinutes().toString().padStart(2, '0');

      if(hour != '00' || minute != '00') {
        dureetext += ' pour ';
      }
      if(hour != '00') {
        dureetext += hour + 'h '
      }
      if(minute != '00') {
        dureetext += minute + 'min '
      }
    } else {
      dureetext = ', toute la journée';
    }

    return RRuleToText(rrule) + dureetext;
  }
  createFormGroup(item: ICalendrierEvent) {
    const date_debut = item.date_debut ?  item.date_debut : new Date();
    const date_fin = item.date_fin ?  item.date_fin : new Date();
    const repeter  = !!item.rrule;
    let rruletext = '';

    if(repeter) {
      const rrule = RRule.fromString(item.rrule);
      const hour = item.duration ? item.duration.split(':').shift() : '00';
      const minute = item.duration ? item.duration.split(':').pop() : '00';
      rruletext = this.getRRuleText(rrule, item.allDay, hour, minute)
    }

    this.createRRuleFormGroup(item);
    return this.formBuilder.group({
      'id': [item.id],
      'affectable_id': [item.affectable_id],
      'affectable_type': [item.affectable_type],
      'date_debut': [date_debut, Validators.required],
      'date_fin': [date_fin, Validators.required],
      'type_id': [item.type_id, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'allDay': [item.allDay],
      'repeter': [repeter],
      'duration': [],
      'description': [item.description],
      'personnels': [null],
      'matieres': [null],
      'rrule_text': [rruletext],
      'rrule': [item.rrule],
    }, {validator: DateValidators.dateLessThan('date_debut', 'date_fin', { 'dateSuperieur': true })});
  }

  createRRuleFormGroup(item: ICalendrierEvent)  {
    const date_debut = item.date_debut ?  item.date_debut : new Date();
    const date_fin = item.date_fin ?  item.date_fin : new Date();
    if(item.rrule) {
      const rrule = RRule.fromString(item.rrule);
      let bymonthtype = 'weekday';
      let endtype = '';
      const duree_heure = item.duration ? item.duration.split(':').shift() : 0;
      const duree_minute = item.duration ? item.duration.split(':').pop() : 0;
      const weekday =  rrule.options.byweekday ? rrule.options.byweekday : [];
      const mappedData = this.weekdaySelect.map((element) => {
        const result = {id : element.id ,  text: element.text, selected: false};
          if (weekday.includes(element.id)) {
            result.selected = true;
          }
          return result;
      });
      this.weekdaySelect2 = of(mappedData);
      if(rrule.options.bysetpos) {
        bymonthtype = 'monthday';
      }

      if(rrule.options.count) {
        endtype = 'count';
      } else if(rrule.options.until){
        endtype = 'until';
      } else {
        endtype = 'no';
      }
      this.rruleGroup = this.formBuilder.group({
        'freq': [rrule.options.freq, Validators.required],
        'dtstart': [rrule.options.dtstart, Validators.required],
        'dtstarttime': [{hour: rrule.options.dtstart.getHours(), minute: rrule.options.dtstart.getMinutes()}],
        'interval': [rrule.options.interval, [Validators.required, Validators.min(1)]],
        'count': [rrule.options.count],
        'until': [rrule.options.until],
        'bysetpos': [rrule.options.bysetpos],
        'bymonth': [rrule.options.bymonth],
        'bymonthday': [{value: 1, disabled: true}],
        'byyearday': [rrule.options.byyearday],
        'byweekno': [rrule.options.byweekno],
        'byweekday': [rrule.options.byweekday],
        'bysingleweekday': [],
        'bymonthtype': [bymonthtype],
        'endtype': [endtype],
        'duree_heure': [duree_heure],
        'duree_minute': [duree_minute]
      },{validator: DateValidators.dateLessThanWithoutTime('dtstart', 'until', { 'dateSuperieur': true })});
      return this.rruleGroup.markAllAsTouched();
    }
    const day = date_debut.getDay() -1;


    const mappedData = this.weekdaySelect.map((element) => {
      const result = {id : element.id ,  text: element.text, selected: false};
        if (element.id == day) {
          result.selected = true;
        }
        return result;
    });
    this.weekdaySelect2 = of(mappedData);
    this.rruleGroup = this.formBuilder.group({
      'freq': [Frequency.DAILY, Validators.required],
      'dtstart': [new Date(+date_debut), Validators.required],
      'dtstarttime': [{
        hour: date_debut.getHours(),
        minute: date_debut.getMinutes()
      }],
      'interval': [1, [Validators.required, Validators.min(1)]],
      'count': [1],
      'until': [new Date(+date_fin)],
      'bysetpos': [],
      'bymonth': [],
      'bymonthday': [{value: 1, disabled: true}],
      'byyearday': [],
      'byweekno': [],
      'byweekday': [],
      'bysingleweekday': [day],
      'bymonthtype': ['weekday'],
      'endtype': ['no'],
      'duree_heure': [0],
      'duree_minute': [0]
    },{validator: DateValidators.dateLessThanWithoutTime('dtstart', 'until', { 'dateSuperieur': true })})
    return this.rruleGroup.markAllAsTouched();
}

  onSaveRRule() {
    let rrule: RRule = new RRule();
    let dtstart = new Date(this.rruleGroup.get('dtstart').value);
    const dtstarttime =  this.rruleGroup.get('dtstarttime').value;
    dtstart.setHours(dtstarttime.hour);
    dtstart.setMinutes(dtstarttime.minute);
    switch(this.rruleGroup.get('freq').value) {
      case Frequency.DAILY:
        rrule = new RRule({
          freq: RRule.DAILY,
          interval: this.rruleGroup.get('interval').value,
          dtstart: dtstart,
        })
        break;
        case Frequency.WEEKLY:
        rrule = new RRule({
          freq: RRule.WEEKLY,
          interval: this.rruleGroup.get('interval').value,
          dtstart: dtstart,
          byweekday: this.rruleGroup.get('byweekday').value.map(element=>  +element)
        })
        break;
        case Frequency.MONTHLY:

        if(this.rruleGroup.get('bymonthtype').value == 'weekday') {
          rrule = new RRule({
            freq: RRule.WEEKLY,
            interval: this.rruleGroup.get('interval').value,
            dtstart: dtstart,
            byweekday: this.rruleGroup.get('bysingleweekday').value,
            bysetpos: this.rruleGroup.get('bysetpos').value
          })
        } else {
          rrule = new RRule({
            freq: RRule.WEEKLY,
            interval: this.rruleGroup.get('interval').value,
            dtstart: dtstart,
            bymonthday: this.rruleGroup.get('bymonthday').value
          })
        }
        break;

        case Frequency.YEARLY:

        if(this.rruleGroup.get('bymonthtype').value == 'weekday') {
          rrule = new RRule({
            freq: RRule.WEEKLY,
            interval: this.rruleGroup.get('interval').value,
            dtstart: dtstart,
            byweekday: this.rruleGroup.get('bysingleweekday').value,
            bysetpos: this.rruleGroup.get('bysetpos').value,
            bymonth: this.rruleGroup.get('bymonth').value
          })
        } else {
          rrule = new RRule({
            freq: RRule.WEEKLY,
            interval: this.rruleGroup.get('interval').value,
            dtstart: dtstart,
            bymonthday: this.rruleGroup.get('bymonthday').value,
            bymonth: this.rruleGroup.get('bymonth').value
          })
        }
        break;

        default: return;

    }

    const endType = this.rruleGroup.get('endtype').value;

    if(endType=='count') {
      rrule.origOptions.count = this.rruleGroup.get('count').value;
      rrule.options.count = this.rruleGroup.get('count').value;
    } else if(endType == 'until'){
      rrule.origOptions.until = new Date(this.rruleGroup.get('until').value);
      rrule.options.until = new Date(this.rruleGroup.get('until').value);
    }

    let rruletext = '';
    if(!this.editForm.get('allDay').value) {
      const hour = (''+this.rruleGroup.get('duree_heure').value).toString().padStart(2, '0');
      const minute = (''+this.rruleGroup.get('duree_minute').value).toString().padStart(2, '0');
      const duree = hour +':'+minute
      this.editForm.get('duration').setValue(duree);
      rruletext = this.getRRuleText(rrule, false, hour, minute);
    } else {
      this.editForm.get('duration').setValue(null);
      rruletext = this.getRRuleText(rrule);
    }

    this.editForm.get('rrule_text').setValue(rruletext);
    this.editForm.get('rrule').setValue(rrule.toString());
    this.editForm.get('rrule').markAsDirty();
    this.editForm.get('rrule').updateValueAndValidity();

  }

  getMonthDayBymonth() {
    const month =   this.rruleGroup.get('bymonth').value;
    const nbDay =   this.getDaysInMonth(month, 2012);
    return this._monthdatselectByMonth$.next(Array(nbDay).fill(0).map((x,i)=>i+1));
  }

  getDaysInMonth = function(month,year) {
   return new Date(year, month, 0).getDate();
  };

}
