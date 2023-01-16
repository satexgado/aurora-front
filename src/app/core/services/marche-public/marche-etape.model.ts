import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MpMarcheEtape } from '../../models/marche-public/marche-etape.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class MpMarcheEtapeFactory extends Factory<MpMarcheEtape> {
  protected readonly endpoint: string = 'marche-public/marche-etapes';

  constructor() {
    super(MpMarcheEtape)
  }

  changePosition(item: {type_procedures: {id, position}[]}): Observable<any> {
    return this.authAccess
    .post(`${this.url}${this.endpoint}/change-position`,
    this.adapter.toFormData(item));
  }
}
