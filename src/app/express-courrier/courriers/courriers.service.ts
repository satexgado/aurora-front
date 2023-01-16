import { ApiResponse } from './../../shared/models/ApiResponse';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CourriersService extends BaseService {
  constructor() {
    super('courrier/courriers');
  }

  getByUser(user: number) {
    return this.factory.get(`users/${user}/courriers`).pipe(
      tap(this.listResponseHandler()),
      map((response: ApiResponse<any>) => response.data)
    );
  }
}
