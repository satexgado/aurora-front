import { Injectable } from '@angular/core';
import { CrCloture } from '../../models/gestion-courrier/cr-cloture';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrClotureFactory extends Factory<CrCloture> {
  protected readonly endpoint: string = 'courrier/clotures';

  constructor() {
    super(CrCloture)
  }

}
