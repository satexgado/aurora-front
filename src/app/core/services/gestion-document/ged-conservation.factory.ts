import { Injectable } from '@angular/core';
import { GedConservation } from '../../models/gestion-document/ged-conservation.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedConservationFactory extends Factory<GedConservation> {
  protected readonly endpoint: string = 'ged-conservations';

  constructor() {
    super(GedConservation)
  }

}
