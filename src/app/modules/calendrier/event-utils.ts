import { CalendrierEventType } from 'src/app/core/models/calendar/event-type.model';
import { EventInput } from '@fullcalendar/angular';
import { ICalendrierEvent } from 'src/app/core/models/calendar/event.model';
import * as moment from 'moment';
import RRule from 'rrule';
let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00'
  }
];

export function createEventId() {
  return String(eventGuid++);
}

export function toCalendarData(calEvent: ICalendrierEvent) {
  let color =  '#5d78ff';
  let className = '';

  if(calEvent.type instanceof CalendrierEventType) {
    color = calEvent.type.couleur;
  }
  
  if(calEvent.rrule) {
    className ="repeat-event";
  }

  return {
    groupId: 'group'+calEvent.id,
    id: ''+calEvent.id,
    title: calEvent.libelle,
    className: className,
    start: calEvent.date_debut??null,
    end: calEvent.date_fin??null,
    allDay: !!calEvent.allDay,
    backgroundColor: color,
    color: color,
    extendedProps: calEvent,
    rrule: calEvent.rrule,
    duration: calEvent.duration
  } as EventInput
}

export const FRANCAIS = {
  dayNames: [
      'Dimance', 'Lundi', 'Mardi', 'Mercredi',
      'Jeudi', 'Vendredi', 'Samedi'
  ],
  monthNames: [
      'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai',
      'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre',
      'Novembre', 'Decembre'
  ],
  tokens: {
      'SKIP': /^[ \r\n\t]+|^\.$/,
      'number': /^[1-9][0-9]*/,
      'numberAsText': /^(un|deux|trois)/i,
      'every': /^chaque/i,
      'day(s)': /^jours?/i,
      'weekday(s)': /^jour de semaine?/i,
      'week(s)': /^semaines?/i,
      'hour(s)': /^heures?/i,
      'minute(s)': /^minutes?/i,
      'month(s)': /^mois?/i,
      'year(s)': /^ans?/i,
      'on': /^(le|à)/i,
      'at': /^(au)/i,
      'the': /^le/i,
      'first': /^premier/i,
      'second': /^deuxième/i,
      'third': /^troisième/i,
      'nth': /^([1-9][0-9]*)(\.|th|nd|rd|st)/i,
      'last': /^dernier/i,
      'for': /^pour/i,
      'time(s)': /^fois?/i,
      'until': /^jusqu'au/i,
      'monday': /^lu(n(di)?)?/i,
      'tuesday': /^ma(r(di)?)?/i,
      'wednesday': /^me(r(credi)?)?/i,
      'thursday': /^je(u(di)?)?/i,
      'friday': /^ve(n(dredi)?)?/i,
      'saturday': /^sa(m(edi)?)?/i,
      'sunday': /^di(m(anche)?)?/i,
      'january': /^jan(vier)?/i,
      'february': /^fev(rier)?/i,
      'march': /^mar(s)?/i,
      'april': /^avr(il)?/i,
      'may': /^mai/i,
      'june': /^juin?/i,
      'july': /^juil(let)?/i,
      'august': /^Aout?/i,
      'september': /^sep(t(embre)?)?/i,
      'october': /^oct(obre)?/i,
      'november': /^nov(embre)?/i,
      'december': /^dec(embre)?/i,
      'comma': /^(,\s*|(and|or)\s*)+/i
  }
};

export const  FRANCAISStrings = {
  '(~ approximate)': '~ environ',
  'and': 'et',
  'at':'en',
  'day':'jour',
  'days':'jours',
  'every':'chaque',
  'for': 'pour',
  'hour':'heure',
  'hours': 'heures',
  'in': 'en',
  'last': 'dernier',
  'minutes': 'minutes',
  'month': 'mois',
  'months': 'mois',
  'nd': '',
  'on the': 'le',
  'on':'le',
  'or': 'ou',
  'rd': ' ',
  'st': ' ',
  'th': ' ',
  'the': 'le',
  'time': 'fois',
  'times': 'fois',
  'until': "jusqu'au",
  'week': 'semaine',
  'weekday': 'jour de semaine',
  'weekdays': 'jour de semaine',
  'weeks': 'semaines',
  'year': 'année',
  'years': 'ans',
  'RRule error: Unable to fully convert this rrule to text': 'Erreur RRule : impossible de convertir complètement ce module en texte'
}

export const GETFRANCAISTEXT = id => {
  return FRANCAISStrings[id] || id;
};
export const RRuleToText = (rrule: RRule, locale = 'fr') => {
  moment.locale(locale);
  const language = {
    dayNames: moment.weekdays(),
    monthNames: moment.months(),
    tokens: null
  };

  const date_debut = moment(rrule.options.dtstart).format("LL");

  const dateFormat = (year, month, day) =>
    moment()
      .date(day)
      .year(year)
      .month(month)
      .format("LL");

  return rrule
    ?
      'à partir du '+ date_debut + ' ' +  rrule.toText(GETFRANCAISTEXT, language, dateFormat)
    : "";
};
