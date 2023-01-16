import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { ConditionsUtilisation } from './conditions-utilisations.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConditionsUtilisationsService extends BaseService<ConditionsUtilisation> {
  constructor() {
    super('conditions-utilisations');
  }

  get() {
    return this.factory.get(`${this.endPoint}`).pipe(
      tap({
        next: (conditions) => {
          this.singleData = conditions;
        },
        error: (error) => this.errorResponseHandler(error),
      })
    );
  }

  edit(data: ConditionsUtilisation) {
    return this.factory.put(`${this.endPoint}`, data).pipe(
      tap({
        next: (conditions: ConditionsUtilisation) =>
          (this.singleData = conditions),
        error: (error) => this.errorResponseHandler(error),
      })
    );
  }
}
