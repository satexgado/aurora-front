import { CrServiceDefault } from './../../models/gestion-courrier/cr-service-default';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrServiceDefaultFactory extends Factory<CrServiceDefault> {
  protected readonly endpoint: string = 'courrier/service-defaults';

  constructor() {
    super(CrServiceDefault)
  }

}
