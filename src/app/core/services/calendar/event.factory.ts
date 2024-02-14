import { CalendrierEvent } from './../../models/calendar/event.model';
import { Injectable } from '@angular/core';
import { Factory } from 'src/app/core/services/factory';

@Injectable({
    providedIn: 'root'
})
export class CalendrierEventFactory extends Factory<CalendrierEvent> {
  protected readonly endpoint: string = 'calendrier/calendriers';

  constructor() {
    super(CalendrierEvent)
  }

}
