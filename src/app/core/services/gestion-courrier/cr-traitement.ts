import { CrTraitement } from './../../models/gestion-courrier/cr-traitement';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrTraitementFactory extends Factory<CrTraitement> {
  protected readonly endpoint: string = 'courrier/traitements';

  constructor() {
    super(CrTraitement)
  }

}
