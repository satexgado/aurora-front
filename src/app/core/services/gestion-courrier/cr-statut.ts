import { Injectable } from '@angular/core';
import { CrStatut } from '../../models/gestion-courrier/cr-statut';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrStatutFactory extends Factory<CrStatut> {
  protected readonly endpoint: string = 'courrier/statuts';

  constructor() {
    super(CrStatut)
  }

}
