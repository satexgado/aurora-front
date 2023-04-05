import { Factory, ListResult } from './factory';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { QueryOptions } from 'src/app/shared/models/query-options';
import { AdaptableMapper } from 'src/app/shared/decorator/adapter/adaptable-mapper';
import { CrTache } from '../models/gestion-courrier/cr-tache';


@Injectable({
    providedIn: 'root'
})
export class UserFactory extends Factory<User> {
  protected readonly endpoint: string = 'users';

  constructor() {
    super(User)
  }

  
  list(queryOptions?: QueryOptions): Observable<ListResult<User>> {
    return super.list(queryOptions??null).pipe(
        map((data: ListResult<User>) => {
          let adapter = new AdaptableMapper(CrTache);
          data.data = data.data.map(
            (user)=> {
              if(user.tache_linkeds) {
                user.tache_linkeds = user.tache_linkeds.map(item => adapter.fromSource(item));
              }
              return user;
            }
          );
          return data;
        })
      );
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
