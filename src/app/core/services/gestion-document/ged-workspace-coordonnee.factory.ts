import { Injectable } from '@angular/core';
import { GedWorkspaceCoordonnee } from '../../models/gestion-document/ged-workspace-coordonnee.model';
import { Factory } from '../factory';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class GedWorkspaceCoordonneeFactory extends Factory<GedWorkspaceCoordonnee> {
  protected readonly endpoint: string = 'ged-workspace-coordonnees';

  constructor() {
    super(GedWorkspaceCoordonnee)
  }

  public createmulti(item: {removedCoordonnees?: any[], coordonnees: any[]}): Observable<GedWorkspaceCoordonnee[]> {
    return this.authAccess
      .post(`${this.url}${this.endpoint}/multi`, item)
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map(
          (data)=> {
            data = this.convertData(data) as GedWorkspaceCoordonnee[];
            return data;
          }
        )
      );
  }

}
