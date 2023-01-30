import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { BaseService } from 'src/app/shared/services/base.service';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Employe } from './employe.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeService extends BaseService<Employe> {
  structure$ = new ReplaySubject<Structure>(1);
  constructor() {
    super('employes');
  }

  getByStructure(structure: number, params: Params): Observable<any> {
    return this.factory
      .get(`structures/${structure}/${this.endPoint}`, { params })
      .pipe(tap(this.listResponseHandler()));
  }

  validate(employe: number): Observable<any> {
    return this.factory.put(`${this.endPoint}/${employe}/validate`, {}).pipe(
      tap((response) => {
        this.data = this._data.filter((_) => _.id != response.id);
      })
    );
  }

  store(elements: object) {
    return this.factory.post('employes', elements).pipe(
      tap({
        next: (response) => {
          this.lastItemCreated = response;
          // this.unshiftItemInData(response);
        },
        error: (error) => {
          this.errorResponseHandler(error);
        },
      })
    );
  }
}
