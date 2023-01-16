import { CrCourrierEtape } from './../../models/gestion-courrier/cr-courrier-etape';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCourrierEtapeFactory extends Factory<CrCourrierEtape> {
  protected readonly endpoint: string = 'courrier/courrier-etapes';

  constructor() {
    super(CrCourrierEtape)
  }

}
