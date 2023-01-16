import { CrCourrierEntrant } from './../../models/gestion-courrier/cr-courrier-entrant';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCourrierEntrantFactory extends Factory<CrCourrierEntrant> {
  protected readonly endpoint: string = 'courrier/courrier-entrants';

  constructor() {
    super(CrCourrierEntrant)
  }

}
