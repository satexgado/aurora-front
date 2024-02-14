import { Injectable } from '@angular/core';
import { GedWorkspaceUser } from '../../models/gestion-document/ged-workspace-user.model';
import { Factory } from '../factory';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class GedWorkspaceUserFactory extends Factory<GedWorkspaceUser> {
  protected readonly endpoint: string = 'ged-workspace-users';

  constructor() {
    super(GedWorkspaceUser)
  }

  public createmulti(item: {removedUsers?: any[], users: any[]}): Observable<GedWorkspaceUser[]> {
    return this.authAccess
      .post(`${this.url}${this.endpoint}/multi`, item)
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map(
          (data)=> {
            data = this.convertData(data) as GedWorkspaceUser[];
            return data;
          }
        )
      );
  }
}
