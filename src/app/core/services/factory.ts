import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { AdaptableMapper } from './../../shared/decorator/adapter/adaptable-mapper';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, retryWhen, delay, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { AppInjector, AuthService } from 'src/app/shared/services';
import { Observable } from 'rxjs';
import { ApiResource, ApiAffectable } from 'src/app/shared';
import { Factory as AuthAccess} from 'src/app/helpers/factory/factory'
export interface ListResult<T> {
  current_page: number; data: T[]; from: number; last_page: number; per_page: number; total: number;
}

export class Factory<T> implements ApiResource, ApiAffectable {
  protected authService: AuthService;
  protected myHeader: HttpHeaders;
  protected httpClient: HttpClient;
  protected readonly url: string = '';
  protected readonly endpoint: string = '';
  protected adapter: AdaptableMapper<T>;
  protected authAccess: AuthAccess;

  constructor(type: { new(): T ; }) {
      const injector = AppInjector.getInjector();
      this.httpClient = injector.get(HttpClient);
      this.authAccess = injector.get(AuthAccess);
      this.authService = new AuthService();
      this.adapter = new AdaptableMapper(type);
  }

  public create(item: any): Observable<T> {
    return this.authAccess
      .post(`${this.url}${this.endpoint}`, this.adapter.toFormData(item)).
      pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map(data => this.adapter.fromSource(data) as T)
      );
  }

  public update(item: any, id = item.id): Observable<T> {
    item._method = 'PUT';
    // item.append('_method', 'PUT');
    return this.authAccess
      .post(`${this.url}${this.endpoint}/${id}`,
        this.adapter.toFormData(item))
      .pipe(map(data => this.adapter.fromSource(data) as T));
  }

  read(id: number): Observable<T> {
    return this.authAccess
    .get(`${this.url}${this.endpoint}/${id}`)
    .pipe(
      retryWhen(errors => errors.pipe(delay(5000), take(10))),
      map((data: any) => this.adapter.fromSource(data) as T)
    );
  }

  list(queryOptions?: QueryOptions): Observable<ListResult<T>> {
    return this.authAccess
      .post(`${this.url}${this.endpoint}/all`, queryOptions)
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map((data: ListResult<T>) => {
          data.data = this.convertData(data.data) as T[];
          return data;
        })
      );
  }

  delete(id: number) {
    return this.authAccess
      .delete(`${this.url}${this.endpoint}/${id}`)
      .pipe(retryWhen(errors => errors.pipe(delay(5000), take(10))));
  }

  restore(id: number) {
    return this.authAccess
      .get(`${this.url}${this.endpoint}/restore/${id}`)
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map((data: any) => this.adapter.fromSource(data) as T)
      );
  }

  attachAffectation(id: number, relationName: string, relationId: number | number[]) {
    const param = {id,  relation_name: relationName,relation_id:  relationId};
    return this.authAccess.post(`${this.url}${this.endpoint}/attach-affectation`, param).pipe(retryWhen(errors => errors.pipe(delay(5000), take(10))));
  }

  detachAffectation(id: number, relationName: string, relationId: number) {
    const param = {id,  relation_name: relationName,relation_id:  relationId};
    return this.authAccess.post(`${this.url}${this.endpoint}/detach-affectation`, param).pipe(retryWhen(errors => errors.pipe(delay(5000), take(10))));
  }

  getAffectations(id: number) {
    return this.authAccess.get(`${this.url}${this.endpoint}/affecter/${id}`).pipe(retryWhen(errors => errors.pipe(delay(5000), take(10))));
  }

  setAffectations(id: number | number[], affectationId: object) {
      const param = {id, affectation: affectationId};
      return this.authAccess.post(`${this.url}${this.endpoint}/affecter`, param).pipe(retryWhen(errors => errors.pipe(delay(5000), take(10))));
  }

  protected convertData(data: any): T[] {
    return data.map(item => this.adapter.fromSource(item));
  }
}
