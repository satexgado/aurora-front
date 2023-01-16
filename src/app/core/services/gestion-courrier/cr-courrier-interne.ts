import { CrCourrierInterne } from './../../models/gestion-courrier/cr-courrier-interne';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCourrierInterneFactory extends Factory<CrCourrierInterne> {
  protected readonly endpoint: string = 'courrier/courrier-internes';

  constructor() {
    super(CrCourrierInterne)
  }

}
