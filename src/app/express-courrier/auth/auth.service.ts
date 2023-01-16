import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Storage } from 'src/app/helpers/storage/storage';
import { BaseService } from 'src/app/shared/services/base.service';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  public user$ = new ReplaySubject<User>(1);
  constructor(public storage: Storage) {
    super('auth');
  }

  get user(): any {
    return { ...this.storage.getUser() };
  }

  get structuresID(): any[] {
    return [...this.storage.getStructures()];
  }

  resendEmailVerification(user: number): Observable<any> {
    return this.factory.get(`user/${user}/email/resend`);
  }

  logout() {
    return this.factory.post('auth/logout', {}).pipe(
      tap({
        next: () => {
          this.storage.clear();
        },
      })
    );
  }

  public login(elements: { email: string; password: string }): Observable<any> {
    return this.factory.post('auth/login', elements).pipe(
      tap({
        next: (response) => {
          this.storage.clear();
          this.storage.save(response);
          this.user$.next(this.user);
        },
      })
    );
  }

  getConditionsUtilisation() {
    return this.factory
      .get('conditions-utilisations')
      .pipe(tap(this.onlyErrorResponseHandler()));
  }

  public register(id: number, elements: any): Observable<any> {
    return this.factory.post(`auth/register/${id}`, elements).pipe(
      tap({
        next: (response) => {
          this.storage.save(response);
        },
      })
    );
  }

  checkUserInformation(params: Params): Observable<any> {
    return this.factory.get(`register/check`, { params });
  }

  isLoggedIn() {
    return this.storage.getAccessToken() && this.storage.getUser();
  }
}
