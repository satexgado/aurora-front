import { Injectable } from '@angular/core';
import { CrDomaine } from '../../models/gestion-courrier/cr-domaine';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrDomaineFactory extends Factory<CrDomaine> {
  protected readonly endpoint: string = 'courrier/domaines';

  constructor() {
    super(CrDomaine)
  }

}
