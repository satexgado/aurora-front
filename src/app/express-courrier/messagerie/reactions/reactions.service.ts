import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResponse } from 'src/app/shared/models/ApiResponse';
import { BaseService } from 'src/app/shared/services/base.service';
import { Structure } from '../../structure/structure/structure.model';
import { Discussion } from '../discussion/discussion.model';
import { Reaction } from './reaction.model';

@Injectable({
  providedIn: 'root',
})
export class ReactionsService extends BaseService<Reaction> {
  hasNextPage = false;
  discussion$ = new ReplaySubject<Discussion>(1);
  dataFetched$ = new Subject<{ discussionId: number }>();

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
    super('reactions');
  }

  public rebondissement$ = new Subject<Reaction>();

  getByDiscussion(
    merge: boolean,
    discussion: number,
    params: Params
  ): Observable<Reaction[]> {
    return this.factory
      .get(`discussions/${discussion}/reactions`, { params })
      .pipe(
        tap((response: ApiResponse<Reaction>) => {
          const data = response.data.reverse();
          if (!merge) this.data = data;
          else this.unshiftItemInData(data);

          this.dataFetched$.next({ discussionId: discussion });

          this.hasNextPage = !!response.next_page_url;
        }),
        map((response) => this.data)
      );
  }

  getFichierByDiscussion(
    discussion: number,
    params: Params
  ): Observable<Reaction[]> {
    return this.factory
      .get(`discussions/${discussion}/fichiers`, { params });
  }

  store(elements: object) {
    return this.factory.post(this.endPoint, elements).pipe(
      tap({
        next: (response) => {
          this.lastItemCreated = response;
          this.pushItemInData(response);
        },
        error: (error) => {
          this.errorResponseHandler(error);
        },
      })
    );
  }
}
