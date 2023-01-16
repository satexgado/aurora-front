import { CrCourrierSortant } from './../../models/gestion-courrier/cr-courrier-sortant';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCourrierSortantFactory extends Factory<CrCourrierSortant> {
  protected readonly endpoint: string = 'courrier/courrier-sortants';

  constructor() {
    super(CrCourrierSortant)
  }

}
