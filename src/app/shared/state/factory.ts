import { AuthService } from '../services/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppInjector } from '../services/app-injector.service';
import { Observable } from 'rxjs';
import { QueryOptions } from '../models/query-options';
import { environment } from 'src/environments/environment';

export interface ListResult {
  current_page: number; data: any[]; from: number; last_page: number; per_page: number; total: number;
}

export class Factory {
  protected authService: AuthService;
  protected myHeader: HttpHeaders;
  protected httpClient: HttpClient;
  protected readonly url: string = environment.api_url;
  protected readonly endpoint: string = '';

  constructor(endpoint?: string) {
      const injector = AppInjector.getInjector();
      this.httpClient = injector.get(HttpClient);
      this.authService = new AuthService();
      this.endpoint = endpoint ? endpoint : '';
  }

  public create(item: any): Observable<any> {
    return this.httpClient
      .post<any>(`${this.url}/${this.endpoint}`, item);
  }

  public update(item: any, id = item.id): Observable<any> {
    item.append('_method', 'PUT');
    return this.httpClient
    .post<any>(`${this.url}/${this.endpoint}/${id}`, item);

  }

  read(id: number): Observable<any> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}/${id}`);
  }

  list(queryOptions?: QueryOptions): Observable<ListResult> {
    return  this.httpClient.post(`${this.url}/${this.endpoint}/all`, queryOptions) as Observable<ListResult>;
  }

  delete(id: number) {
    return this.httpClient
      .delete(`${this.url}/${this.endpoint}/${id}`);
  }

  attachAffectation(id: number, relation_name: string, relation_id: number) {
    const param = {id,  relation_name, relation_id};
    return this.httpClient.post(`${this.url}/${this.endpoint}/attach-affectation`, param, {
        headers: this.myHeader
    });
  }

  detachAffectation(id: number, relation_name: string, relation_id: number) {
    const param = {id,  relation_name, relation_id};
    return this.httpClient.post(`${this.url}/${this.endpoint}/detach-affectation`, param, {
        headers: this.myHeader
    });
  }

  getAffectations(id: number) {
    return this.httpClient.get(`${this.url}/${this.endpoint}/affecter/${id}`, {
        headers: this.myHeader
    });
  }

  setAffectations(id: number, affectation_id: object) {
      const param = {id, affectation: affectation_id};
      return this.httpClient.post(`${this.url}/${this.endpoint}/affecter`, param, {
          headers: this.myHeader
      });
  }

}
