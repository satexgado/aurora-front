import { CrSuivi } from './../../models/gestion-courrier/cr-suivi';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrSuiviFactory extends Factory<CrSuivi> {
  protected readonly endpoint: string = 'courrier/suivis';

  constructor() {
    super(CrSuivi)
  }

}
