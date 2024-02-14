import { CalendrierEventGroup } from './../../models/calendar/event-group.model';
import { Injectable } from '@angular/core';
import { Factory } from 'src/app/core/services/factory';

@Injectable({
    providedIn: 'root'
})
export class CalendrierEventGroupFactory extends Factory<CalendrierEventGroup> {
  protected readonly endpoint: string = 'calendrier/groupe-calendriers';

  constructor() {
    super(CalendrierEventGroup)
  }

}
