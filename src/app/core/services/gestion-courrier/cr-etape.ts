import { Injectable } from '@angular/core';
import { CrEtape } from '../../models/gestion-courrier/cr-etape';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrEtapeFactory extends Factory<CrEtape> {
  protected readonly endpoint: string = 'courrier/etapes';

  constructor() {
    super(CrEtape)
  }

}
