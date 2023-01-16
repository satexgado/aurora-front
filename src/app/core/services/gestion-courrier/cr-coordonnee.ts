import { Injectable } from '@angular/core';
import { CrCoordonnee } from '../../models/gestion-courrier/cr-coordonnee';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCoordonneeFactory extends Factory<CrCoordonnee> {
  protected readonly endpoint: string = 'courrier/coordonnees';

  constructor() {
    super(CrCoordonnee)
  }

}
