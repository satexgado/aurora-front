import { ApiResponse } from './../../shared/models/ApiResponse';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService extends BaseService<Notification> {
  hasNextPage = false;
  constructor() {
    super('notifications');
  }

  getData(merge: boolean, params: Params): Observable<Notification[]> {
    return this.factory.get(this.endPoint, { params }).pipe(
      tap((response: ApiResponse<Notification>) => {
        if (!merge) this.data = response.data;
        else this.pushItemInData(response.data);

        this.hasNextPage = !!response.next_page_url;
        // if (this.data.length) this.prependNewDiscussion();
      }),
      map((response) => response.data)
    );
  }
}
