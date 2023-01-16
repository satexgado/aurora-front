import { delay, take, retryWhen, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Dossier } from './../../models/gestion-document/dossier.model';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class DossierFactory extends Factory<Dossier> {
  protected readonly endpoint: string = 'dossiers';

  constructor() {
    super(Dossier)
  }

  public checkPassword(id,password): Observable<number|any> {
    return this.authAccess
      .post(`${this.url}${this.endpoint}/checkpassword/${id}`,
      {password: password})
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map(data => {
          if(!data) {
            return 0;
          }
         return this.adapter.fromSource(data)
        })
      );
  }

}
