import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService, NotificationService } from 'src/app/shared';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserAdapter, User } from 'src/app/shared/state/user';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private adapter: UserAdapter;
  private _userInfo$: Observable<User>;
  constructor(
    private _http: HttpClient,
    private environmentService: EnvironmentService,
    private notificationService: NotificationService
  ) {
      this.adapter = new UserAdapter();
  }

  get notifier()
  {
    return this.notificationService;
  }
  get userInfo$()
  {
    if (!this._userInfo$) {
        this._userInfo$ = this.getUser().pipe(
          shareReplay(1)
        );
    }
    return this._userInfo$;
  }

  login(loginData){
    let url = this.environmentService.setAuthService('oauth/token')
    return this._http.post(url, loginData)
    .pipe(
        map(res=> res),
        catchError(this.handleError)
    )
  }

  logOut(){
    let url = this.environmentService.setAuthService('logout')
    return this._http.post(url, {})
        .pipe(
            map(res=> res),
            tap(()=>{
                this.userInfo$.subscribe((res)=>{
                    this.notificationService.onSuccess(`A bientôt ${res.nom_complet}`)
                    this._userInfo$ = null;
                })
            }),
            catchError(this.handleError)
        )
  }

  getUser(){
    let url = this.environmentService.setAuthService('user')
    return this._http.get(environment.api_url+'/auth/me')
    .pipe(
        map(res=> this.adapter.fromJson(res) as User),
        tap((res)=>{
            this.notificationService.onSuccess(`${res.nom_complet}`, 'Bienvenue')
        }),
        catchError(this.handleError)
    )
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    const body = error || '';
    errMsg = error.message ? error.message : error.toString();
    console.log(errMsg);
    return throwError(body);
  }
}
