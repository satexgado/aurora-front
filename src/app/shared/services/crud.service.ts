import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  fullUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, public router: Router) { }
  //Methode Http
  post(hote: string, gert: any) { 
    // const $request=this.gettokenparams(localStorage.getItem('access_token'));
    const url = this.fullUrl + hote;
    //const obj = JSON.parse(JSON.stringify(gert));
    return this.http.post(url, gert);

   // return this.http.post(url, gert);
  }
  postfile(hote: string, gert: any,id: any) {
    const url = this.fullUrl + hote+id;
    //const obj = JSON.parse(JSON.stringify(gert));
   

    return this.http.post(url, gert);
  }


  put(hote: string, gert: any, id: any) {
    const url = this.fullUrl + hote + id;
    //const obj = JSON.parse(JSON.stringify(gert));
    return this.http.put(url, gert);
  }

  delete(hote: string, $id: any) {
    const url = this.fullUrl + hote + $id;
    return this.http.delete(url);
  }
  get(hote: string) {
    const url = this.fullUrl + hote;
    // const $request=this.gettokenparams(localStorage.getItem('access_token'));
    return this.http.get(url);

      // return this.http.get(url);
  }
  getById(hote: string, $id: any) {
    const url = this.fullUrl + hote + $id;
    return this.http.get(url);
  }
      //search name
  search(hote:string,formData : string) {
    const url = this.fullUrl + hote + formData;
      //const obj = JSON.parse(JSON.stringify(formData));
      return this.http.get(url);
  
  }
  console() {
    console.clear();
    console.log("%c" + "ATTENTION !!!", "color: red; font-size: x-large");
    console.log("%c" + "Il s’agit d’une fonctionnalité de navigateur conçue pour les développeurs. Si quelqu’un vous a invité(e) à copier-coller quelque chose ici pour activer une fonctionnalité ou soit-disant pirater le compte d’un tiers, sachez que c’est une escroquerie permettant à cette personne d’accéder à votre compte.", "color: black; font-size: 20px");
  }
 
 
}


