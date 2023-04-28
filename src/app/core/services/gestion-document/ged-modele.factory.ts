import { Injectable } from '@angular/core';
import { GedModele } from '../../models/gestion-document/ged-modele.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedModeleFactory extends Factory<GedModele> {
  protected readonly endpoint: string = 'ged-modeles';

  constructor() {
    super(GedModele)
  }

}
