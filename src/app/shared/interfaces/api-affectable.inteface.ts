import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export abstract class ApiAffectable {
  /**
   * Returns a list of all of the current user's todos.
   */
  abstract  attachAffectation(id: number, relationName: string, relationId: number): Observable<any>;
  abstract  detachAffectation(id: number, relationName: string, relationId: number): Observable<any>;
  abstract  getAffectations(id: number): Observable<any>;
  abstract  setAffectations(id: number, affectationId: object): Observable<any>;
}