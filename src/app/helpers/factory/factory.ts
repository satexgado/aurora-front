import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '../storage/storage';
// import { TokenStorage } from "./token-storage.service";

@Injectable({
  providedIn: 'root',
})
export class Factory {
  public baseUrl = environment.api_url;
  private _headers = {
    Authorization: `Bearer ${this.storage.getAccessToken()}`,
  };

  constructor(
    public storage: Storage,
    public http: HttpClient // public _tokenStorage: TokenStorage
  ) {}

  public get(endPoint: string, options?: object): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${endPoint}`, {
      headers: {
        Authorization: `Bearer ${this.storage.getAccessToken()}`,
      },
      ...options,
    });
  }

  public post(endPoint: string, data: {}, options?: object): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endPoint}`, data, {
      headers: {
        Authorization: `Bearer ${this.storage.getAccessToken()}`,
      },
      ...options,
    });
  }

  public put(endPoint: string, elements: any, options?: any): Observable<any> {
    if(elements instanceof FormData) {
      elements.append('_method', 'PUT')
    } else {
      elements['_method'] = 'PUT';
    }
    return this.http.post<any>(`${this.baseUrl}/${endPoint}`, elements, {
      headers: {
        Authorization: `Bearer ${this.storage.getAccessToken()}`,
      },
      ...options,
    });
  }

  public patch(endPoint: string, elements: {}, options?: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${endPoint}`, elements, {
      headers: {
        Authorization: `Bearer ${this.storage.getAccessToken()}`,
      },
      ...options,
    });
  }

  public delete(endPoint: string, options?: object): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${endPoint}`, {
      headers: {
        Authorization: `Bearer ${this.storage.getAccessToken()}`,
      },
      ...options,
    });
  }
}
