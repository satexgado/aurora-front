import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { Structure } from './structure.model';

@Injectable({
  providedIn: 'root',
})
export class StructureService extends BaseService<Structure> {
  structureToEdit$ = new ReplaySubject<any>(1);

  private _organigrammeData: any[] = [];
  public organigrammeData$ = new ReplaySubject<any[]>(1);

  private _autresStructures: any[] = [];
  public autresStructures$ = new ReplaySubject<any[]>(1);

  set organigrammeData(data: any[]) {
    this._organigrammeData = data;
    this.organigrammeData$.next(this._organigrammeData);
  }

  set autresStructures(data: any[]) {
    this._autresStructures = data;
    this.autresStructures$.next(this._autresStructures);
  }

  constructor() {
    super('structures');
  }

  getStructure(): Observable<any> {
    return this.factory.get(this.endPoint).pipe(
      tap({
        next: (response) => {
          this.data = response.data;
        },
        error: (error) => {
          this.errorResponseHandler(error);
        },
      })
    );
  }

  getOldestAncestor(structure: number) {
    return this.factory.get(`${this.endPoint}/${structure}/oldest`).pipe(
      tap({
        next: (response) => {
          this.organigrammeData = response;
        },
        error: (error) => this.errorResponseHandler(error),
      })
    );
  }

  // Renvoie la structure et ses sous structures
  getStructureEtSousStructures(structure: number): Observable<any> {
    return this.factory
      .get(`${this.endPoint}/${structure}/structure-et-sous-structures`)
      .pipe(tap(this.onlyErrorResponseHandler()));
  }

  store(elements: any, emit = true) {
    return this.factory.post(this.endPoint, elements).pipe(
      tap({
        next: (response) => {
          this.lastItemCreated = response;
          this.data = [...this.data, response];
          // if (emit) this.appendSousStructure(response.parent_id, response);
        },
        error: (error) => {
          this.errorResponseHandler(error);
        },
      })
    );
  }

  getByUser(user: number) {
    return this.factory
      .get(`users/${user}/structures`)
      .pipe(tap(this.onlyErrorResponseHandler()));
  }

  getByUserWDossiers(user: number) {
    return this.factory
      .get(`users/${user}/structuresWdossiers`)
      .pipe(tap(this.onlyErrorResponseHandler()));
  }

  update(id: number, data: Object) {
    return this.factory.put(`${this.endPoint}/${id}`, data).pipe(
      tap({
        next: (response) => {
          if (response.id == this._singleData?.id) {
            this.singleData = { ...this._singleData, ...response };
          } else {
            this.updateItemInData(id, response);
          }
        },
        error: (error) => this.errorResponseHandler(error),
      })
    );
  }

  private appendSousStructure(structureParent: number, structure: any): void {
    let _structureParent = this._data
      .flatMap((_structure) => _structure.sous_structures)
      .find((_structure) => _structure.id == structureParent);

    if (_structureParent?.sous_structures)
      _structureParent.sous_structures.push(structure);
    else this.getSousStructure(structureParent).subscribe();
  }

  // Recupere les structures qui sont enfants directes de la structure concérné
  getSousStructure(structure: number): Observable<any> {
    return this.factory
      .get(`${this.endPoint}/${structure}/sous-structures`)
      .pipe(
        tap({
          next: (response) => {
            let _structure = this._organigrammeData
              .flatMap((_structure) => _structure.sous_structures)
              .find((_structure) => _structure.id == structure);

            _structure.sous_structures = response.data;
            this.organigrammeData$.next(this._organigrammeData);
          },
          error: (error) => {
            this.errorResponseHandler(error);
          },
        })
      );
  }

  // Recuperer tous les structures enfants ou petits enfants de la structure donnée
  getAllSousStructures(structure: number, params: Params): Observable<any> {
    return this.factory
      .get(`${this.endPoint}/${structure}/sous-structures/all`, { params })
      .pipe(
        tap({
          next: (response) => {
            this.paginationInfo = {
              total: response.total,
              itemsPerPage: response.per_page,
              currentPage: response.current_page,
            };
          },
          error: (error) => {
            this.errorResponseHandler(error);
          },
        }),
        map((response) => response.data)
      );
  }

  // Recuperes tous les structures qui sont lié au à la personne
  getAutresStructures(params: Params): Observable<any> {
    return this.factory.get(`${this.endPoint}/autres`, { params }).pipe(
      tap({
        next: (response) => {
          this.autresStructures = response.data;

          this.paginationInfo = {
            total: response.total,
            itemsPerPage: response.per_page,
            currentPage: response.current_page,
          };
        },
      })
    );
  }
}
