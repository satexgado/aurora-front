import { Injectable } from '@angular/core';
import { CrCoordonneeGroupe } from '../../models/gestion-courrier/cr-coordonnee-groupe';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCoordonneeGroupeFactory extends Factory<CrCoordonneeGroupe> {
  protected readonly endpoint: string = 'courrier/coordonnee-groupes';

  constructor() {
    super(CrCoordonneeGroupe)
  }

}
