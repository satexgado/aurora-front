import { DefaultQueryOption } from './../models/query-options/query-options.model';
import { Factory } from './../../core/services/factory';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { QueryOptions, Filter } from '../models/query-options';
import { SortDirection } from '../directives';
import { debounceTime, tap, switchMap, retryWhen, delay, take, catchError } from 'rxjs/operators';
import { AppInjector } from '../services';
import { NotificationService } from '../notification';
import { Injectable } from '@angular/core';
import { filterGrp, DefaultQueryOptionWithIns } from '../models/query-options/query-options.model';
import { IBase } from 'src/app/core/models/base.interface';


interface ListResult {
    current_page: number; data: IBase[]; from: number; last_page: number; per_page: number; total: number;
}
@Injectable()
export class ResourceScrollableHelper {
    private _search$ = new Subject<void>();
    private _loading$ = new BehaviorSubject<boolean>(false);
    private _queryOptions: QueryOptions;
    private _listResult$ = new Subject<ListResult>();

    service: Factory<any>;
    notificationService: NotificationService;
    searchCustomFilterGroup: filterGrp;
    _searchTerm: string;
    hasMoreData: boolean;
    withoutPaginate: boolean;
    keepData = true;
    private _data$ = new BehaviorSubject<IBase[]>([]);

    get data$() {
        return this._data$.asObservable();
    }

    constructor(service: Factory<any>, queryOptions: QueryOptions = DefaultQueryOption) {
        const injector = AppInjector.getInjector();
        this.notificationService = injector.get(NotificationService);
        this.service = service;

        //create a copy of queryoptions to avoid some error
        this._queryOptions = JSON.parse(JSON.stringify(queryOptions));

        this._queryOptions.paginate = 64;
        this._queryOptions.page = 1;

        this._search$.pipe(
            debounceTime(800),
            tap(() => this._loading$.next(true)),
            switchMap(() => this.search(this._queryOptions)),
            tap(() => this._loading$.next(false))
          ).subscribe(result => {
            let data;

            if(this.keepData) {
              data = this._data$.value && this.page != 1  ? this._data$.value : [] ;
              data = [...data, ...result.data];

              // retirer les potentiels duplicata
              data = data.filter((item, index, self) =>
                  index === self.findIndex((t) => (
                  t.id === item.id
                  ))
              );
            } else {
              data = result.data;
            }

            this._listResult$.next(result);
            this._data$.next(data);
            this.hasMoreData = this._queryOptions.page < result.last_page;
            this._queryOptions.page += 1;
        },
          error => {
              if (error.status === 500) {
                this.notificationService.onError('Impossible d\'éffectuer cette requête');
                this._loading$.next(false);
              }
          });
    }

    get loading$() { return this._loading$.asObservable(); }
    get listResult() {return this._listResult$.asObservable(); }

    get page() { return this._queryOptions.page; }
    set page(page: number) {
        this._queryOptions.page = page;
        this._search$.next();
    }
    get pageSize() { return this._queryOptions.paginate; }
    set pageSize(paginate: number) {
        this._queryOptions.paginate = paginate;
        // localStorage.setItem('pageSize', `${paginate}`);
        // this._search$.next();
    }

    get searchTerm() { return this._searchTerm; }
    set searchTerm(searchTerm: string) {
        this._searchTerm = searchTerm;
        if ((!searchTerm.length) || /\S/.test(searchTerm)) {
            this.page = 1;
            this._search$.next();
        }
    }
    get currentData() {return this._data$.getValue(); }

    get query() { return this._queryOptions.filter_groups; }

    set query(filter_groups: filterGrp[]) {
        this._queryOptions.filter_groups = filter_groups;
    }

    get relations() { return this._queryOptions.includes; }

    set relations(relations: string[]) {
        this._queryOptions.includes = relations;
    }

    set sortColumn(sortColumn: string) {
        this._queryOptions.sort[0].key = sortColumn;
        this.page = 1;
    }

    set sortDirection(sortDirection: SortDirection) {
        this._queryOptions.sort[0].direction = sortDirection;
        if (sortDirection === '') {
            this._queryOptions.sort[0].direction = 'DESC';
            this._queryOptions.sort[0].key = 'updated_at';
        }
        this.page = 1;
    }

    trackByFn(index, item) {
        return item.id; // or index
    }

    loadData(page?: number) {
        if (page) {
            this._queryOptions.page = page;
        }
        this._search$.next();
    }

    search(queryOptions: QueryOptions) {
        const query: QueryOptions = JSON.parse(JSON.stringify(queryOptions));

        if (this.searchCustomFilterGroup) {
            query.filter_groups.push(this.searchCustomFilterGroup);
        }

        if (this._searchTerm && ((!this._searchTerm.length) || /\S/.test(this._searchTerm))) {
          query.filter_groups.push(
            {or: false, filters:[new Filter('searchString', this._searchTerm, 'ct')]},
          );
        }

        if (this.withoutPaginate) {
            query.page = undefined;
            query.paginate = undefined;
        }

        return this.service.list(query).pipe(
            retryWhen(errors => errors.pipe(delay(5000), take(10))),
            catchError(this.handleError)
        );
    }

    addItem(item: IBase) {
        const data = this._data$.value ? this._data$.value : [] ;
        data.unshift(item);
        this._data$.next(data);
    }

    addItemTo(item: IBase, index = 0) {
      const data = this._data$.value ? this._data$.value : [] ;
      data.splice( index, 0, item);
      this._data$.next(data);
    }

    updateItem(item: IBase) {
        let data = this._data$.value ? this._data$.value : [] ;
        data = data.map(element => {
            if (element.id === item.id ) {
                element = item;
            }
            return element;
        });
        this._data$.next(data);
    }

    removeItem(id: number) {
        const data = this._data$.value ? this._data$.value : [] ;
        const index = data.findIndex(element => element.id === id);
        data.splice(index, 1);
        this._data$.next(data);
        return index;
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        const body = error || '';
        errMsg = error.message ? error.message : error.toString();
        console.log(errMsg);
        return throwError(body);
    }
}
