import { Factory as AuthAccess} from 'src/app/helpers/factory/factory'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  fullUrl = environment.apiUrl;
  //$id=3;

  constructor(private http: HttpClient, protected authAccess: AuthAccess) { }
  //Methode Http
  post(hote: string, gert: any) {
    const url =  hote;
    return this.authAccess.post(url, gert);
  }
  postfile(hote: string, gert: any,id:any) {
    const url =  hote+id;
    return this.authAccess.post(url, gert);
  }


  put(hote: string, gert: any, id:any) {
    const url =  hote + id;
    return this.authAccess.put(url, gert);
  }

  delete(hote: string, $id:any) {
    const url =  hote + $id;
    return this.authAccess.delete(url);
  }
  get(hote: string) {
    const url =  hote;
    return this.authAccess.get(url);
  }
  getById(hote: string, $id:any) {
    const url =  hote + $id;
    return this.authAccess.get(url);
  }
    //search name
  search(hote:string,formData : string) {
    const url =  hote + formData;
    return this.authAccess.get(url);
  }
  console() {
    // console.clear();
    // console.log("%c" + "ATTENTION !!!", "color: red; font-size: x-large");
    // console.log("%c" + "Il s’agit d’une fonctionnalité de navigateur conçue pour les développeurs. Si quelqu’un vous a invité(e) à copier-coller quelque chose ici pour activer une fonctionnalité ou soit-disant pirater le compte d’un tiers, sachez que c’est une escroquerie permettant à cette personne d’accéder à votre compte.", "color: black; font-size: 20px");
  }
}
