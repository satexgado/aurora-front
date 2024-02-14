import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { CalendrierEventTypeFactory } from 'src/app/core/services/calendar/event-type.factory';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ICalendrierEvent, CalendrierEvent, } from 'src/app/core/models/calendar/event.model';
import { QueryOptions } from 'src/app/shared/models/query-options';
import { NotificationService } from 'src/app/shared';
import { CalendrierEventFactory } from 'src/app/core/services/calendar/event.factory';
import { CalendrierEventEditModalComponent } from './event-edit-modal/event-edit-modal.component';
import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventChangeArg } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import { INITIAL_EVENTS, toCalendarData, RRuleToText } from './event-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICalendrierEventType } from 'src/app/core/models/calendar/event-type.model';
import { DatePipe } from '@angular/common';
import RRule, { RRuleSet } from 'rrule';
import * as moment from 'moment';
// import { IPersonnel } from 'src/app/core/models/rh/personnel.model';

declare var $:any;

@Component({
  selector: 'app-calendar-ui',
  templateUrl: './calendar-ui.component.html',
  providers:[DatePipe]
})
export class CalendarUiComponent implements OnInit  {

    isCalendarLoading: boolean = true;
    @Input() eventParent: {name: string, id: number};
    @Input() reloadCalendar(eventParent:  {name: string, id: number}) {
      this.eventParent = eventParent;
      this.loadEvent();
    }

    typeEvenement$: Observable<ICalendrierEventType[]>;
    constructor(
      protected modalService: NgbModal,
      public datepipe: DatePipe,
      protected notificationService: NotificationService,
    ) {

    }

    calendarVisible = true;
    calendarOptions: CalendarOptions = {
    locale: 'fr',
    locales: [ frLocale ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventChange: this.handleDateChange.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
    datesSet: this.onClosePopover.bind(this),
  };
  currentEvents: EventApi[] = [];

  ngOnInit() {
    this.loadEvent();
    const eventTypeService = new CalendrierEventTypeFactory();
    this.typeEvenement$ = eventTypeService.list().pipe(map(
      (data:{data})=> {
        return data.data? data.data : null;
      }
    ))
  }

  loadEvent() {
    this.isCalendarLoading = true;
    const service = new CalendrierEventFactory();
    const queryOptions = new QueryOptions();
    if(this.eventParent) {
      queryOptions.filter_groups = [
        {or: false, filters:[new Filter('affectable_type', this.eventParent.name, 'eq'),new Filter('affectable_id', this.eventParent.id, 'eq')]},
      ];
    };
    queryOptions.includes = [
      'cal_type_calendrier', 'participants'
      // , 'visi_matieres',
      // 'personnels.user', 'personnels.visi_masque_personnel', 'personnels.visi_poste', 'personnels.visi_matieres'
    ];
    service.list(queryOptions).subscribe(
      (data)=> {
        const calEvents = data.data.map(
          element => toCalendarData(element)
        );
        console.log(calEvents);
        this.calendarOptions.events = calEvents;
        this.isCalendarLoading = false;
      }
    );
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateChange(changeInfo: EventChangeArg) {
    if(changeInfo.event._def.recurringDef){
      return changeInfo.revert();
    }
    const confirm = () => {
      this.isCalendarLoading = true;
      let calEvent = new CalendrierEvent();
      calEvent.date_debut = changeInfo.event.start;
      calEvent.date_fin = changeInfo.event.end;
      calEvent.allDay = changeInfo.event.allDay;
      calEvent.libelle = changeInfo.event.title;
      const service = new CalendrierEventFactory();
      service.update({
        date_debut: calEvent.date_debut,
        date_fin: calEvent.date_fin,
        allDay: calEvent.allDay
      }, changeInfo.event.id).subscribe(
      ()=> this.isCalendarLoading = false
      );
    };

    const cancel = () => {
      changeInfo.revert();
    };

    this.notificationService.title = 'Validation';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir modifier?' + ' ' + changeInfo.event.title;

    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm, cancel);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;
  }

  handleDataSelectPopover(selectInfo: DateSelectArg) {
    if(!selectInfo.jsEvent){
      return;
    }
    const popup = $(selectInfo.jsEvent.target);
    moment.locale('fr');
    popup.popover({
      html: true,
      container:'full-calendar',
      trigger: 'focus',
      template: `
          <div class="card-1 popover calendar-popover">
              <div class="arrow"></div>
              <h3 class="popover-header p-0 border-0"></h3>
              <div class="popover-body">
              </div>
          </div>`
          ,
      title: `
      <div class="toast-header">
        <div class="col-11 text-truncate p-0">
          <strong class="mx-1">Creer un évènement</strong>
        </div>
        <button type="button" class="close col-1"  aria-label="Close" (click)="">
          <span aria-hidden="true"><i class="icon-close"></i></span>
        </button>
      </div>
      `,
      content: `<div class="toast-body">
      <div class="form-group">
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Libelle">
      </div>
      <p class="text-center">Du ${moment(selectInfo.start).format("LLLL")}</p>
      <p class="text-center">Au ${moment(selectInfo.end).format("LLLL")}</p>
      </div>`
  }).popover('show');
  return ;
  }
  handleDateSelect(selectInfo: DateSelectArg) {

    const modalRef = this.modalService.open(CalendrierEventEditModalComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as CalendrierEventEditModalComponent;
    let item: ICalendrierEvent = new CalendrierEvent();
    item.date_debut = selectInfo.start;
    item.date_fin = selectInfo.end;
    item.allDay = selectInfo.allDay;
    if(this.eventParent) {
      item.affectable_id = this.eventParent.id;
      item.affectable_type = this.eventParent.name;
    }
    instance.title = 'Ajouter un évènement'
    instance.item = item;
    instance.newItem.subscribe(
      (data: ICalendrierEvent) => {
          const calendarApi = selectInfo.view.calendar;
          calendarApi.unselect(); // clear date selection
          calendarApi.addEvent(toCalendarData(data));
      }
    )
  }

  onUpdateEvent(clickInfo: EventClickArg) {
        const modalRef = this.modalService.open(CalendrierEventEditModalComponent, { size: 'lg', centered: true,  backdrop: 'static' });
        modalRef.componentInstance.title = `Modifier: ${clickInfo.event.title}`;
        modalRef.componentInstance.item = clickInfo.event.extendedProps;
        modalRef.componentInstance.isUpdating = true;
        modalRef.componentInstance.newItem.subscribe(
          (data: ICalendrierEvent) => {
            clickInfo.event.remove()
            clickInfo.view.calendar.addEvent(toCalendarData(data));
          }
        );
  }

  onUpdateFutureEvent(clickInfo: EventClickArg) {
    let item = Object.assign({}, clickInfo.event.extendedProps) as CalendrierEvent;
    let rrule = RRule.fromString(item.rrule);

    if(moment(rrule.all().shift()).isSame(clickInfo.event.start)) {
      return this.onUpdateEvent(clickInfo);
    };

    let updateOldRrule = rrule.clone();
    rrule.options.dtstart = clickInfo.event.start??new Date();
    rrule.origOptions.dtstart = clickInfo.event.start;
    item.rrule = rrule.toString();

    const days = 86400000 //number of milliseconds in a day
    let date = new Date(+(clickInfo.event.start??new Date()) - days);
    updateOldRrule.options.until = date;
    updateOldRrule.origOptions.until = date;
    const service = new CalendrierEventFactory();
    const updateOldRecurring =  service.update({rrule: updateOldRrule.toString()},+clickInfo.event.id);

    const modalRef = this.modalService.open(CalendrierEventEditModalComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    modalRef.componentInstance.title = `Modifier Les futures occurences: ${clickInfo.event.title}`;
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.newItem.pipe(
      switchMap(
        (data: ICalendrierEvent) => {
          clickInfo.event.remove()
          clickInfo.view.calendar.addEvent(toCalendarData(data));
          return updateOldRecurring;
        }
      )
    ).subscribe(
      (data)=> {
        this.isCalendarLoading = false;
        clickInfo.event.remove()
        clickInfo.view.calendar.addEvent(toCalendarData(data));
      }
    );
}


  handleEventClick(clickInfo: EventClickArg) {
    this.onClosePopover();
    const popup = $(clickInfo.jsEvent.target);
    const formatedDate = this.formatDate(clickInfo.event);
    const calEvent = clickInfo.event.extendedProps as ICalendrierEvent;
    let callbackFunction;
    let eventBody = `<div class="text-center">${formatedDate}</div>
    <div class="toast-body">`;
    if(calEvent.type){
      eventBody += `
      <p style="color: ${calEvent.type.couleur}"><i class="fad fa-circle tx-16"></i> ${calEvent.type.libelle}</p>
      `;
    }

    if(calEvent.participants && calEvent.participants.length) {
      eventBody += `<p><i class="fad fa-user tx-16" ></i> `;

      calEvent.participants.forEach((element,index)=> {

        eventBody += element.libelle;
        if (index != calEvent.participants.length - 1) {
          eventBody += `, `;
        }
      })

      eventBody += `</p>`
    }

    // if(calEvent.personnels && calEvent.personnels.length) {
    //   calEvent.personnels.forEach((element: IPersonnel,index)=> {
    //     eventBody += `<p class="tx-yeto2 mb-0"><i class="${element.masque.icon} tx-16" ></i> ${element.libelle}</p>`;
    //     eventBody += `<p class="tx-yeto">${element.title}</p>`;
    //   })
    // }

    // if(calEvent.matieres && calEvent.matieres.length) {
    //   eventBody += `<p><span class="tx-yeto2"><i class="fad fa-database tx-16" ></i>Matières: </span>`;

    //   calEvent.matieres.forEach((element,index)=> {

    //     eventBody += `<span class="tx-yeto">${element.libelle}</span>`;
    //     if (index != calEvent.matieres.length - 1) {
    //       eventBody += `, `;
    //     }
    //   })

    //   eventBody += `</p>`
    // }

    if(!clickInfo.event._def.recurringDef) {
      eventBody += `
        </div>
        <div class="d-flex justify-content-center">
            <button class="link btn btn-link btn-sm px-1  tx-gray-600 tx-11"><i class="fal fa-eye"></i> Detail</button>
            <button class="update link btn btn-link btn-sm px-1  tx-gray-600 tx-11"><i class="fal fa-exchange"></i> Modifier</button>
            <button class="delete link btn btn-link btn-link-danger btn-sm px-1  tx-gray-500 tx-11"><i class="fal fa-trash-alt"></i> Supprimer</button>
        </div>
      `;
      callbackFunction = this.onGetEventPopupFunction(clickInfo);
    } else {
      eventBody += `
        <p><i class="fad fa-repeat tx-16" ></i> ${RRuleToText(clickInfo.event._def.recurringDef.typeData)}</p>
        </div>
        <div class="d-flex justify-content-center">
            <button class="link btn btn-link btn-sm px-1  tx-gray-600 tx-11"><i class="fal fa-eye"></i> Detail</button>
            <div class="dropdown">
              <button class="link btn btn-link btn-sm px-1  tx-gray-600 tx-11" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fal fa-exchange"></i> Modifier
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <button class="dropdown-item update-future btn btn-link btn-sm">Cet occurence et les futurs</button>
                <button class="dropdown-item update btn btn-link btn-sm">Toutes les occurences</button>
              </div>
            </div>
            <div class="dropdown">
              <button class=" link btn btn-link btn-link-danger btn-sm px-1  tx-gray-600 tx-11" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fal fa-trash-alt"></i> Supprimer
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                <button class="dropdown-item delete-future btn btn-link btn-sm">Cet occurence et les futurs</button>
                <button class="dropdown-item delete btn btn-link btn-sm">Toutes les occurences</button>
              </div>
            </div>
         </div>
      `;
      callbackFunction = this.onGetRecurringEventPopupFunction(clickInfo)
    }


    popup.popover({
        html: true,
        container:'full-calendar',
        trigger: 'focus',
        template: `
            <div class="card-1 popover calendar-popover">
                <div class="arrow"></div>
                <h3 class="popover-header p-0 border-0"></h3>
                <div class="popover-body">
                </div>
            </div>`
            ,
         title: `
        <div class="toast-header">
          <div class="col-11 text-truncate p-0">
            <strong class="mx-1">${clickInfo.event.title}</strong>
          </div>
          <button type="button" class="close col-1"  aria-label="Close" (click)="testFonction()">
            <span aria-hidden="true"><i class="icon-close"></i></span>
          </button>
        </div>
        `,
        content: eventBody
    }).on('shown.bs.popover', callbackFunction).popover('show');

  }

  onRemoveEvent(event: EventApi, additionalTitle = ' ') {
    const confirm = () => {
      this.isCalendarLoading = true;
      const service = new CalendrierEventFactory();
      service.delete(+event.id).subscribe(
        ()=> {
          this.isCalendarLoading = false;
          event.remove();
        }
      );
    };

    this.notificationService.title = 'Validation';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + additionalTitle + event.title;

    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;
  }

  formatDate(calEvent: EventApi) {
    let result = '';
    let date_debut = calEvent.start;
    let date_fin = calEvent.end;

    if(!(date_debut && date_fin)) {
      return;
    }
    if(calEvent.allDay) {
      result += this.datepipe.transform(date_debut, 'dd/MM/yyyy');
      if(date_fin && !(date_debut.getDate() === date_fin.getDate()
      && date_debut.getMonth() === date_fin.getMonth()
      && date_debut.getFullYear() === date_fin.getFullYear())) {
        result += ' - '+this.datepipe.transform(date_fin, 'dd/MM/yyyy')
      }
      return result
    }

    result += this.datepipe.transform(date_debut, 'dd/MM/yyyy HH:mm');
    if(date_fin) {
      if(!(date_debut.getDate() === date_fin.getDate()
      && date_debut.getMonth() === date_fin.getMonth()
      && date_debut.getFullYear() === date_fin.getFullYear())) {
        result += ' - '+this.datepipe.transform(date_fin, 'dd/MM/yyyy HH:mm')
      } else {
        result += ' - '+this.datepipe.transform(date_fin, 'HH:mm')
      }
    }

    return result;
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }


  onClosePopover() {
    $('.calendar-popover').popover('dispose');
  }

  onGetEventPopupFunction(clickInfo: EventClickArg) {
    const popup = $(clickInfo.jsEvent.target);
    const removeEvent = () => {
      this.onRemoveEvent(clickInfo.event);
    };
    const updateEvent = () => {
      this.onUpdateEvent(clickInfo);
    };
    return function () {
          const id = $(this).attr('aria-describedby');
          $('#'+id).find('button.close').on('click', function (e) {
            popup.popover('dispose');
          });
          $('#'+id).find('button.delete').on('click', function (e) {
            removeEvent();
            popup.popover('dispose');
        });
        $('#'+id).find('button.update').on('click', function (e) {
          updateEvent();
          popup.popover('dispose');
      });
    };
  }

  onGetRecurringEventPopupFunction(clickInfo: EventClickArg) {
    const popup = $(clickInfo.jsEvent.target);
    const removeEvent = () => {
      this.onRemoveEvent(clickInfo.event, ' toutes les occurences ');
    };
    const removeFuture = () => {
      this.onRemoveFutureOccurenceEvent(clickInfo);
    }
    const updateEvent = () => {
      this.onUpdateEvent(clickInfo);
    };

    const updateFuture = () => {
      this.onUpdateFutureEvent(clickInfo);
    };
    return function () {
          const id = $(this).attr('aria-describedby');
          $('#'+id).find('button.close').on('click', function (e) {
            popup.popover('dispose');
          });
          $('#'+id).find('button.delete').on('click', function (e) {
            removeEvent();
            popup.popover('dispose');
        });

        $('#'+id).find('button.delete-future').on('click', function (e) {
            removeFuture();
            popup.popover('dispose');
        });

        $('#'+id).find('button.update').on('click', function (e) {
          updateEvent();
          popup.popover('dispose');
      });
      $('#'+id).find('button.update-future').on('click', function (e) {
        updateFuture();
        popup.popover('dispose');
    });
    };
  }

  onRemoveFutureOccurenceEvent(clickInfo: EventClickArg) {
    const confirm = () => {
      this.isCalendarLoading = true;
      const service = new CalendrierEventFactory();
      if(!clickInfo.event.extendedProps.rrule) {
        return this.notificationService.onError("cet événement n'est pas récurrent");
      }
      let rrule = RRule.fromString(clickInfo.event.extendedProps.rrule);
      const days = 86400000 //number of milliseconds in a day
      let date = new Date(+(clickInfo.event.start??new Date()) - days);

      rrule.options.until = date ;
      rrule.origOptions.until = date;
      service.update({rrule: rrule.toString()},+clickInfo.event.id).subscribe(
        (data)=> {
          this.isCalendarLoading = false;
          clickInfo.event.remove()
          clickInfo.view.calendar.addEvent(toCalendarData(data));
        }
      );
    };

    this.notificationService.title = 'Validation';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + 'cet occurence et les futurs de ' + clickInfo.event.title;

    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;
  }

  onRemoveThisOccurenceEvent(clickInfo: EventClickArg) {
    const confirm = () => {
      this.isCalendarLoading = true;
      const service = new CalendrierEventFactory();
      if(!clickInfo.event.extendedProps.rrule) {
        return this.notificationService.onError("cet événement n'est pas récurrent");
      }
      const rruleSet = new RRuleSet();
      rruleSet.rrule(RRule.fromString(clickInfo.event.extendedProps.rrule));
      rruleSet.exdate((clickInfo.event.start??new Date()));
      service.update({rrule: rruleSet.toString()},+clickInfo.event.id).subscribe(
        (data)=> {
          this.isCalendarLoading = false;
          clickInfo.event.remove()
          clickInfo.view.calendar.addEvent(toCalendarData(data));
        }
      );
    };

    this.notificationService.title = 'Validation';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + 'cet occurence et les futurs de ' + clickInfo.event.title;

    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;
  }
}
