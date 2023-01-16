import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { Resource } from './resource';
import { QueryOptions, DefaultQueryOptionWithInsAndSeachString } from '../models/query-options';
import { SortDirection } from '../directives';
import { debounceTime, tap, switchMap, retryWhen, delay, take, catchError } from 'rxjs/operators';
import { AppInjector } from '../services';
import { NotificationService } from '../notification';

interface ListResult {
    current_page: number; data: Resource[]; from: number; last_page: number; per_page: number; total: number;
}
export class ResourcePaginateHelper {
    private _search$ = new Subject<void>();
    private data: ListResult;
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _queryOptions: QueryOptions;
    resource: Resource = new Resource();
    notificationService: NotificationService;

    // using for confirmation
    private _observable: Observable<any>[] = [];

    constructor(resource: Resource, queryOptions?: QueryOptions)
    {
        const injector = AppInjector.getInjector();
        this.notificationService = injector.get(NotificationService);
        this.resource = resource;
        this._queryOptions = queryOptions ?  queryOptions : DefaultQueryOptionWithInsAndSeachString;

        this._queryOptions.paginate = localStorage.getItem("pageSize") ?
        parseInt(localStorage.getItem("pageSize")) : 8 ;

        this._search$.pipe(
            debounceTime(800),
            tap(() => this._loading$.next(true)),
            switchMap(() => this.search(this._queryOptions)),
            tap(() => this._loading$.next(false))
          ).subscribe(result => {
            this.data = result
          },
          error => {
              if(error.status == 500)
              {
                this.notificationService.onError('Impossible d\'éffectuer cette requête')
                this._loading$.next(false);
              }
          });
    }

    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._queryOptions.page; }
    get pageSize() { return this._queryOptions.paginate; }
    get searchTerm() { return this._queryOptions.filter_groups[1].filters[0].value; }

    set page(page: number) {
        this._queryOptions.page = page;
        this._search$.next();
    }

    set pageSize(paginate: number) {
        this._queryOptions.paginate = paginate;
        localStorage.setItem('pageSize',`${paginate}`);
        this._search$.next();
    }

    set searchTerm(searchTerm: string) {
        this._queryOptions.filter_groups[1].filters[0].value = searchTerm;
        if((!searchTerm.length) || /\S/.test(searchTerm))
        {
            this.page = 1;
            this._search$.next();
        }
    }

    set sortColumn(sortColumn: string) {
        this._queryOptions.sort[0].key = this.resource.adaptable.get(sortColumn);
        this._search$.next();
    }

    set sortDirection(sortDirection: SortDirection) {
        this._queryOptions.sort[0].direction = sortDirection;
        if(sortDirection === "") {
            this._queryOptions.sort[0].direction = "DESC";
            this._queryOptions.sort[0].key = "updated_at";
        }
        this._search$.next();
    }


    trackByFn(index, item) {
        return item.id; // or index
    }

    loadData(page?: number)
    {
        if(page)
        {
            this._queryOptions.page = page
        }
        this._search$.next();
    }

    search(queryOptions: QueryOptions)
    {
        return this.resource.list(queryOptions).pipe(
            retryWhen(errors => errors.pipe(delay(5000), take(10))),
            catchError(this.handleError)
        );
    }

    addItem(item: Resource)
    {
        if((!this.data) || (!this.data.data) && (!this.data.data.length))
        {
            return this.notificationService.onInfo('Aucune donnée disponible');
        }
        this.data.data.unshift(item);
    }

    updateItem(item: Resource)
    {
        if((!this.data) || (!this.data.data) && (!this.data.data.length))
        {
            return this.notificationService.onInfo('Aucune donnée disponible');
        }

        this.data.data.map(element=>{
            if(element.id === item.id )
            {
                element = item;
            }
            return element;
        })
    }

    removeItem(id: number)
    {
        if((!this.data) || (!this.data.data) && (!this.data.data.length))
        {
            return this.notificationService.onInfo('Aucune donnée disponible');
        }

        const index = this.data.data.findIndex(user => user.id === id);
        this.data.data.splice(index, 1);
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        const body = error || '';
        errMsg = error.message ? error.message : error.toString();
        console.log(errMsg);
        return throwError(body);
    }
}
