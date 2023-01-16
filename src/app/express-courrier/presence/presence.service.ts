import { User } from 'src/app/express-courrier/users/user.model';
import { UserPresent } from './user-present.model';
import { BaseService } from 'src/app/shared/services/base.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  protected _data: UserPresent[] = [];

  constructor() {}

  addNewPresence(user: UserPresent) {
    this._data.push(user);
  }

  checkPresence(user: User): boolean {
    return !!this._data.find((_) => _.id == user.id);
  }

  deletePresence(user: UserPresent) {
    this._data = this._data.filter((_) => _.id != user.id);
  }

  setUpPresence(users: UserPresent[]) {
    this._data = users;
  }

  getPresences(): UserPresent[] {
    return this._data;
  }
}
