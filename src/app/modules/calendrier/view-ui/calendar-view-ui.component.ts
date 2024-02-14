import { ICalendrierEvent } from 'src/app/core/models/calendar/event.model';
import { QueryOptions } from 'src/app/shared/models/query-options';
import { NotificationService } from 'src/app/shared';
import { CalendrierEventFactory } from 'src/app/core/services/calendar/event.factory';
import { Component, Input } from '@angular/core';
import { CalendarOptions,  EventClickArg, EventApi } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import { INITIAL_EVENTS, toCalendarData, RRuleToText } from '../event-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// import { IPersonnel } from 'src/app/core/models/rh/personnel.model';

declare var $:any;

@Component({
  selector: 'app-calendar-view-ui',
  templateUrl: './calendar-view-ui.component.html',
  providers:[DatePipe]
})
export class CalendarViewUiComponent  {

  @Input('queryOptions') set optionInit(query: QueryOptions) {
    this.isCalendarLoading = true;
    const service = new CalendrierEventFactory();
    service.list(query).subscribe(
      (data)=> {

        const calEvents = data.data.map(
          element => toCalendarData(element)
        );
        this.calendarOptions.events = calEvents;
        this.isCalendarLoading = false;
      }
    );
  }
    isCalendarLoading: boolean = true;

    constructor(
      protected modalService: NgbModal,
      public datepipe: DatePipe,
      protected notificationService: NotificationService,
    ) {

    }

    calendarVisible = true;
    calendarOptions: CalendarOptions = {
    height: 650,
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
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
    datesSet: this.onClosePopover.bind(this),
  };
  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.onClosePopover();
    const popup = $(clickInfo.jsEvent.target);
    const formatedDate = this.formatDate(clickInfo.event);
    const calEvent = clickInfo.event.extendedProps as ICalendrierEvent;
    let eventBody = `<div class="text-center">${formatedDate}</div>
    <div class="toast-body">`;
    if(calEvent.type){
      eventBody += `
      <p><i class="fad fa-circle tx-16" style="color: ${calEvent.type.couleur}"></i> ${calEvent.type.libelle}</p>
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

    if(clickInfo.event._def.recurringDef) {
      eventBody += `<p><i class="fad fa-repeat tx-16" ></i> ${RRuleToText(clickInfo.event._def.recurringDef.typeData)}</p>`;
    }

    eventBody += `
        </div>
    `;


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
    }).on('shown.bs.popover', function () {
      const id = $(this).attr('aria-describedby');
      $('#'+id).find('button.close').on('click', function (e) {
        popup.popover('dispose');
      });
    }).popover('show');

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
}
