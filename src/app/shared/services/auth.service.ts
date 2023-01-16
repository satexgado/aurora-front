import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry,  tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppInjector } from './app-injector.service';
import { User } from '../state/user';

@Injectable({
    providedIn: 'root'
  })
export class AuthService { 
    private redirectUrl: string = '/';
	private loginUrl: string = '/login';
	private loggedInUser: User;
	private httpClient: HttpClient;

    constructor() {
      const injector = AppInjector.getInjector();    
			this.httpClient = injector.get(HttpClient);
	}
	
	doUserAuthentication(username: string, password:string) {
		const fullUrl = environment.api_url + '/auth/login';
		return this.httpClient.post(fullUrl, 
			{"email": username, "password": password},
			{headers: new HttpHeaders({'X-Requested-with': 'XMLHttpRequest'})})
				.pipe( retry(3),catchError(this.handleError),
				map(
					(res: {token_type: string, access_token: string, expires_at: string}) => { 
						res.expires_at = new Date(res.expires_at).getTime().toString();
						console.log(res);
						return res;
					}),
				tap(
					token => {
						localStorage.setItem('token', token.token_type+' '+token.access_token);
						localStorage.setItem('expired_at', token.expires_at)
					})
		);
	}
	handleError(error) {
		let errorMessage = '';
		if (error.error instanceof ErrorEvent) {
		  // client-side error
		  errorMessage = `Error: ${error.error.message}`;
		} else {
		  // server-side error
		  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
		}
		return throwError(errorMessage);
	  }
	isUserLoggedIn(): boolean {
		if (localStorage.getItem("token") !== null 
			&& localStorage.getItem('expired_at')
			&& JSON.parse(localStorage.getItem('expired_at')) > new Date().getTime()
			) {
			return true;
		}
		return false;
	}
	getRedirectUrl(): string {
		return this.redirectUrl;
	}
	setRedirectUrl(url: string): void {
		this.redirectUrl = url;
	}
	getLoginUrl(): string {
		return this.loginUrl;
	}
	setLoggedInUser() {
		if(this.isUserLoggedIn()){
			const fullUrl = environment.api_url + '/auth/logout';
	
			this.httpClient.get(fullUrl, {
				headers: {
					'Authorization': this.getLoggedInUserToken()
				}
			})
			localStorage.removeItem('token');
		}
	}
	getLoggedInUser(): User {
		return this.loggedInUser;
	}
	logoutUser(): void{
		if(this.isUserLoggedIn()){
			const fullUrl = environment.api_url + '/auth/logout';
	
			this.httpClient.get(fullUrl, {
				headers: {
					'Authorization': this.getLoggedInUserToken()
				}
			})
			localStorage.removeItem('token');
			localStorage.removeItem('expired_at');
		}
	}
	getLoggedInUserToken(): string {
		return localStorage.getItem('token');
	}
} 