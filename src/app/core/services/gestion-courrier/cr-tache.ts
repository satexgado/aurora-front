import { Injectable } from '@angular/core';
import { CrTache } from '../../models/gestion-courrier/cr-tache';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrTacheFactory extends Factory<CrTache> {
  protected readonly endpoint: string = 'courrier/taches';

  constructor() {
    super(CrTache)
  }

}
