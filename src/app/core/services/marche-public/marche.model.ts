import { MpMarche } from './../../models/marche-public/marche.model';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class MpMarcheFactory extends Factory<MpMarche> {
  protected readonly endpoint: string = 'marche-public/marches';

  constructor() {
    super(MpMarche)
  }

  tableauxFournisseurs(): Observable<any> {
    return this.authAccess
    .get(`${this.url}${this.endpoint}/table-fournisseurs`);
  }

  tableauxPartenaires(): Observable<any> {
    return this.authAccess
    .get(`${this.url}${this.endpoint}/table-partenaires`);
  }

  analyses(): Observable<any> {
    return this.authAccess
    .get(`${this.url}${this.endpoint}/analyses`);
  }
}
