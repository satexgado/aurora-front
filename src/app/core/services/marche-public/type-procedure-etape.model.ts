import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MpProcedureTypeEtape } from '../../models/marche-public/type-procedure-etape.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class MpProcedureTypeEtapeFactory extends Factory<MpProcedureTypeEtape> {
  protected readonly endpoint: string = 'marche-public/type-procedure-etapes';

  constructor() {
    super(MpProcedureTypeEtape)
  }

  changePosition(item: {type_procedures: {id, position}[]}): Observable<any> {
    return this.authAccess
    .post(`${this.url}${this.endpoint}/change-position`,
    this.adapter.toFormData(item));
  }
}
