import { Injectable } from '@angular/core';
import { MpMarcheType } from '../../models/marche-public/type-marche.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class MpMarcheTypeFactory extends Factory<MpMarcheType> {
  protected readonly endpoint: string = 'marche-public/type-marches';

  constructor() {
    super(MpMarcheType)
  }

}
