import { CrReaffectation } from './../../models/gestion-courrier/cr-reaffectation';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrReaffectationFactory extends Factory<CrReaffectation> {
  protected readonly endpoint: string = 'courrier/reaffectations';

  constructor() {
    super(CrReaffectation)
  }

}
