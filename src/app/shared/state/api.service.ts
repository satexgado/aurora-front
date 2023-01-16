import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppInjector } from '../services/app-injector.service';
import { Observable } from 'rxjs';
import { QueryOptions } from '../models/query-options';

export interface ListResult {
  current_page: number; data: any[]; from: number; last_page: number; per_page: number; total: number;
}

export class ApiService {
  protected myHeader: HttpHeaders;
  protected httpClient: HttpClient;

  constructor() {
      const injector = AppInjector.getInjector();
      this.httpClient = injector.get(HttpClient);
  }

  public create(url: string, item: any): Observable<any> {
    return this.httpClient
      .post<any>(`${url}`, item);
  }

  public update(url: string, item: any, id = item.id): Observable<any> {
    item.append('_method', 'PUT');
    return this.httpClient
    .post<any>(`${url}/${id}`, item);

  }

  public read(url: string, id: number): Observable<any> {
    return this.httpClient
      .get(`${url}/${id}`);
  }

  public list(url: string, queryOptions?: QueryOptions): Observable<ListResult> {
    return  this.httpClient.post(`${url}/all`, queryOptions) as Observable<ListResult>;
  }

  public delete(url: string, id: number) {
    return this.httpClient
      .delete(`${url}/${id}`);
  }

  protected otherWParam(url: string, param) {
    return this.httpClient.post(`${url}`, param, {
        headers: this.myHeader
    });
  }

}
