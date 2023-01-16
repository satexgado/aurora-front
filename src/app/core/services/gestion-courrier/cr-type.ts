import { Injectable } from '@angular/core';
import { CrType } from '../../models/gestion-courrier/cr-type';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrTypeFactory extends Factory<CrType> {
  protected readonly endpoint: string = 'courrier/types';

  constructor() {
    super(CrType)
  }

}
