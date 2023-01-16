import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ListResult {
  current_page: number; data: any[]; from: number; last_page: number; per_page: number; total: number;
}

@Injectable()
export abstract class ApiResource {
  abstract  create(item: any): Observable<any>;
  abstract  update(item: any, id?:number): Observable<any>;
  abstract  read(id: number): Observable<any>;
  abstract  list(item: any): Observable<ListResult>;
  abstract  delete(id: number): Observable<any>;
}