import { Injectable } from '@angular/core';
import { CrNature } from '../../models/gestion-courrier/cr-nature';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrNatureFactory extends Factory<CrNature> {
  protected readonly endpoint: string = 'courrier/natures';

  constructor() {
    super(CrNature)
  }

}
