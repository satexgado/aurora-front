import { map } from 'rxjs/operators';
import { AdaptableMapper } from './../decorator/adapter/adaptable-mapper';
import { AuthService } from '../services/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppInjector } from '../services/app-injector.service';
import { Observable } from 'rxjs';
import { QueryOptions } from '../models/query-options';
import { environment } from 'src/environments/environment';

export interface ListResult {
  current_page: number; data: any[]; from: number; last_page: number; per_page: number; total: number;
}

export class Factory2<T> {
  protected authService: AuthService;
  protected myHeader: HttpHeaders;
  protected httpClient: HttpClient;
  protected readonly url: string = environment.api_url;
  protected readonly endpoint: string = '';
  protected adapter: AdaptableMapper<T>;

  constructor(type: { new(): T ; }) {
      const injector = AppInjector.getInjector();
      this.httpClient = injector.get(HttpClient);
      this.authService = new AuthService();
      this.adapter = new AdaptableMapper(type);
  }

  public create(item: any): Observable<any> {
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}`, this.adapter.toFormData(item)).
      pipe(map(data => this.adapter.fromSource(data) as T));
  }

  public update(item: any, id = item.id): Observable<any> {
    item.append('_method', 'PUT');
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}/${id}`,
        this.adapter.toFormData(item))
      .pipe(map(data => this.adapter.fromSource(data) as T));
  }

  read(id: number): Observable<any> {
    return this.httpClient
    .get(`${this.url}/${this.endpoint}/${id}`)
    .pipe(map((data: any) => this.adapter.fromSource(data) as T));
  }

  list(queryOptions?: QueryOptions): Observable<ListResult> {
    return this.httpClient
      .post(`${this.url}/${this.endpoint}/all`, queryOptions)
      .pipe(map((data: ListResult) => {
        data.data = this.convertData(data.data);
        return data;
      }));
  }

  delete(id: number) {
    return this.httpClient
      .delete(`${this.url}/${this.endpoint}/${id}`);
  }

  attachAffectation(id: number, relationName: string, relationId: number) {
    const param = {id,  relationName, relationId};
    return this.httpClient.post(`${this.url}/${this.endpoint}/attach-affectation`, param, {
        headers: this.myHeader
    });
  }

  detachAffectation(id: number, relationName: string, relationId: number) {
    const param = {id,  relationName, relationId};
    return this.httpClient.post(`${this.url}/${this.endpoint}/detach-affectation`, param, {
        headers: this.myHeader
    });
  }

  getAffectations(id: number) {
    return this.httpClient.get(`${this.url}/${this.endpoint}/affecter/${id}`, {
        headers: this.myHeader
    });
  }

  setAffectations(id: number, affectationId: object) {
      const param = {id, affectation: affectationId};
      return this.httpClient.post(`${this.url}/${this.endpoint}/affecter`, param, {
          headers: this.myHeader
      });
  }

  private convertData(data: any): T[] {
    return data.map(item => this.adapter.fromSource(item));
  }
}
