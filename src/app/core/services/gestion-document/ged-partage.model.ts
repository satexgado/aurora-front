import { Injectable } from '@angular/core';
import { GedPartage } from '../../models/gestion-document/ged-partage.model';
import { Factory } from '../factory';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class GedPartageFactory extends Factory<GedPartage> {
  protected readonly endpoint: string = 'ged-partages';

  constructor() {
    super(GedPartage)
  }

  public createmulti(item: any[]): Observable<GedPartage[]> {
    return this.authAccess
      .post(`${this.url}${this.endpoint}`, item.map(formData=>this.adapter.toFormData(formData)))
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map(
          (data)=> {
            data = this.convertData(data) as GedPartage[];
            return data;
          }
        )
      );
  }

}
