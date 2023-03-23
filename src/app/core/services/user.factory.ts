import { Factory } from './factory';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class UserFactory extends Factory<User> {
  protected readonly endpoint: string = 'users';

  constructor() {
    super(User)
  }

  zenContact(id: number): Observable<User[]> {
    return this.authAccess
      .get(`${this.url}${this.endpoint}/zen-contact/${id}`)
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map((data: User[]) => {
          return data.map(item =>
            {
              let adap = this.adapter.fromSource(item);
              adap['messages_tres_urgent_count']= item['messages_tres_urgent_count'];
              adap['messages_urgent_count']= item['messages_urgent_count'];
              adap['messages_normal_count']= item['messages_normal_count'];
              return adap;
            }
          ) as User[];
        })
      );
  }

  onlineUsers(): Observable<any[]> {
    return this.authAccess
      .get(`${this.url}${this.endpoint}/online`)
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map((data: any[]) => {
         return data.map(item=> {
            item.last_activity_at = new Date(item.last_activity_at);
            return item;
          })
        })
      );
  }

}
