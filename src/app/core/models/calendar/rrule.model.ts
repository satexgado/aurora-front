import { IBase } from 'src/app/core/models/base.interface';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { ByWeekday, Frequency, Weekday } from 'rrule';

export interface ICalendrierRRule extends IBase {
  freq: Frequency;
  dtstart: Date | null;
  interval: number;
  wkst: Weekday | number | null;
  count: number | null;
  until: Date | null;
  bysetpos: number | number[] | null;
  bymonth: number | number[] | null;
  bymonthday: number | number[] | null;
  bynmonthday: number[] | null;
  byyearday: number | number[] | null;
  byweekno: number | number[] | null;
  byweekday: ByWeekday | ByWeekday[] | null;
}

export class CalendrierRRule implements ICalendrierRRule {
    @adaptableMap('id_calendrier')
    id: number = 0;
    libelle: string = '';

    freq = Frequency.YEARLY;

    @dateAdaptableMap('dtstart')
    dtstart:Date = null;

    @dateAdaptableMap('until')
    until:Date = null;

    interval: number = 1;
    wkst: Weekday | number | null = null;
    count: number | null = null;
    bysetpos: number | number[] | null = null;
    bymonth: number | number[] | null = null;
    bymonthday: number | number[] | null = null;
    bynmonthday: number[] | null = null;
    byyearday: number | number[] | null = null;
    byweekno: number | number[] | null = null;
    byweekday: ByWeekday | ByWeekday[] | null = null;


}
