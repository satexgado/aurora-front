import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Storage } from 'src/app/helpers/storage/storage';
import { BaseService } from '../../shared/services/base.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService<User> {
  constructor(public storage: Storage) {
    super('users');
  }

  store(elements: object) {
    return this.factory.post(`${this.endPoint}`, elements).pipe(
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

  update(id: number, data: {}) {
    return this.factory.put(`${this.endPoint}/${id}`, data).pipe(
      tap({
        next: (response) => {
          // this.updateItemInData(id, response);
          this.lastItemEdited$.next(response as User);

          // if (this._singleData) {
          //   this.singleData = response;
          // }
        },
        error: (error) => this.errorResponseHandler(error),
      })
    );
  }

  updatePassword(data: {}) {
    return this.factory.put(`password/${this.endPoint}`, data).pipe(
      tap({
        next: (response) => {},
        error: (error) => this.errorResponseHandler(error),
      })
    );
  }

  getEmployes(params: Params): Observable<any> {
    return this.factory
      .get(
        `users/employes`
        // , { params }
      )
      .pipe(tap(this.listResponseHandler()));
  }

  getByRole(role: number) {
    return this.factory
      .get(`roles/${role}/users`)
      .pipe(tap(this.listResponseHandler()));
  }

  changerRole(user: number, role: number) {
    return this.factory.post(`${this.endPoint}/roles`, { user, role }).pipe(
      tap((data) => {
        this.storage.set('authorisations', data.authorisations);
      })
    );
  }
}
