import { CrAmpiliation } from './../../models/gestion-courrier/cr-ampiliation';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrAmpiliationFactory extends Factory<CrAmpiliation> {
  protected readonly endpoint: string = 'courrier/ampiliations';

  constructor() {
    super(CrAmpiliation)
  }

}
