import { Injectable } from '@angular/core';
import { MpProcedureType } from '../../models/marche-public/type-procedure.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class MpProcedureTypeFactory extends Factory<MpProcedureType> {
  protected readonly endpoint: string = 'marche-public/type-procedures';

  constructor() {
    super(MpProcedureType)
  }

}
