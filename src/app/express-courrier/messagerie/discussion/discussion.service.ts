import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResponse } from 'src/app/shared/models/ApiResponse';
import { BaseService } from 'src/app/shared/services/base.service';
import { Structure } from '../../structure/structure/structure.model';
import { Correspondance, Discussion } from './discussion.model';

@Injectable({
  providedIn: 'root',
})
export class DiscussionService extends BaseService<Discussion> {
  hasNextPage = false;
  newDiscussion$ = new Subject<Discussion>();

  private _structure: Structure | undefined;
  structure$ = new ReplaySubject<Structure>();

  get structure() {
    return this._structure;
  }

  set structure(structure: Structure | undefined) {
    if (structure) {
      this._structure = structure;
      this.structure$.next(this._structure);
    }
  }

  constructor() {
    super('discussions');
  }

  getByUser(merge: boolean, params: Params) {
    return this.getData(null, merge, params);
  }

  getByStructure(structure: Structure, merge: boolean, params: Params) {
    return this.getData(structure, merge, params);
  }

  getData(
    structure: Structure | null | undefined,
    merge: boolean,
    params: Params
  ): Observable<Discussion[]> {
    const endPoint = structure
      ? `structures/${structure.id}/${this.endPoint}`
      : `${this.endPoint}`;

    return this.factory.get(endPoint, { params }).pipe(
      tap((response: ApiResponse<Discussion>) => {
        if (!merge) this.data = response.data;
        else this.pushItemInData(response.data);

        this.hasNextPage = !!response.next_page_url;

        // if (this.data.length) this.prependNewDiscussion();
      }),
      map((response) => response.data)
    );
  }

  addNewDiscussion(discussion: Discussion): void {
    this._data = this._data.filter((item) => item.id != discussion.id);
    this.unshiftItemInData(discussion);
    this.newDiscussion$.next(discussion);
  }

  check(correspondance: Correspondance): Observable<Discussion> {
    return this.factory.post(`${this.endPoint}/check`, correspondance).pipe(
      tap((response) => {
        this.singleData = response;
      })
    );
  }

  show(id: number, emitData = true) {
    return this.factory.get(`${this.endPoint}/${id}`).pipe(
      tap({
        next: (single) => {
          if (emitData) this.singleData = single;
          this.prependNewDiscussion();
        },
        error: (error) => this.errorResponseHandler(error),
      })
    );
  }

  private prependNewDiscussion() {
    if (this._singleData && !this.findItemInDataByID(this._singleData.id!)) {
      this.unshiftItemInData(this._singleData);
    }
  }
}
