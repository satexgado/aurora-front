import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Params } from '@angular/router';
import { Role } from './roles.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends BaseService<Role> {
  constructor() {
    super('roles');
  }

  getByStructure(structure: number, params?: Params): Observable<any> {
    return this.factory
      .get(`structures/${structure}/roles`, { params })
      .pipe(tap(this.listResponseHandler()));
  }

  getAllByStructure(structure: number, params?: Params): Observable<any> {
    return this.factory
      .get(`structures/${structure}/roles/all`, { params })
      .pipe(tap(this.onlyErrorResponseHandler()));
  }
}
