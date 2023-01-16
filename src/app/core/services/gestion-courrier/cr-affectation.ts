import { CrAffectation } from './../../models/gestion-courrier/cr-affectation';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrAffectationFactory extends Factory<CrAffectation> {
  protected readonly endpoint: string = 'courrier/affectation-courriers';

  constructor() {
    super(CrAffectation)
  }

}
