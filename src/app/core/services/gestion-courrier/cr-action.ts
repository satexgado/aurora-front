import { CrAction } from './../../models/gestion-courrier/cr-action';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrActionFactory extends Factory<CrAction> {
  protected readonly endpoint: string = 'courrier/actions';

  constructor() {
    super(CrAction)
  }

}
