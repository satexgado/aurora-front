import { CalendrierEventType } from './../../models/calendar/event-type.model';
import { Injectable } from '@angular/core';
import { Factory } from 'src/app/core/services/factory';

@Injectable({
    providedIn: 'root'
})
export class CalendrierEventTypeFactory extends Factory<CalendrierEventType> {
  protected readonly endpoint: string = 'calendrier/type-calendriers';

  constructor() {
    super(CalendrierEventType)
  }

}
