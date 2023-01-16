import { Injectable } from '@angular/core';
import { CrCourrier } from '../../models/gestion-courrier/cr-courrier';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCourrierFactory extends Factory<CrCourrier> {
  protected readonly endpoint: string = 'courrier/courriers';

  constructor() {
    super(CrCourrier)
  }

}
