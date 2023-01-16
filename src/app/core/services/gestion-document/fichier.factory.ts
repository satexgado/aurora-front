import { Observable } from 'rxjs';
import { Fichier } from './../../models/gestion-document/fichier.model';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';
import { retryWhen, delay, take, map } from 'rxjs/operators';
import { upload, Upload } from 'src/app/shared';

@Injectable({
    providedIn: 'root'
})
export class FichierFactory extends Factory<Fichier> {
  protected readonly endpoint: string = 'fichiers';

  constructor() {
    super(Fichier)
  }

  public checkPassword(id,password): Observable<Fichier|number> {
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

  public upload(item: any): Observable<Upload> {
    return this.authAccess
      .post(`${this.url}${this.endpoint}`, this.adapter.toFormData(item),{
        reportProgress: true,
        observe: 'events',
      }).
      pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        upload(),
        map(
          (data)=> {
            if(data.state == 'DONE' &&  data.body) {
              data.body = this.adapter.fromSource(data.body) as Fichier;
            }
            return data;
          }
        )
      );
  }
}
