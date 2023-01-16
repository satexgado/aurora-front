import { CrUrgence } from './../../models/gestion-courrier/cr-urgence';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrUrgenceFactory extends Factory<CrUrgence> {
  protected readonly endpoint: string = 'courrier/urgences';

  constructor() {
    super(CrUrgence)
  }

}
