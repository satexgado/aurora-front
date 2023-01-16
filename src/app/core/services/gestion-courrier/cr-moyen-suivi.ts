import { Injectable } from '@angular/core';
import { CrMoyenSuivi } from '../../models/gestion-courrier/cr-moyen-suivi';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrMoyenSuiviFactory extends Factory<CrMoyenSuivi> {
  protected readonly endpoint: string = 'courrier/moyen-suivis';

  constructor() {
    super(CrMoyenSuivi)
  }

}
