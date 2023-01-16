import { CrStructureCopie } from './../../models/gestion-courrier/cr-structure-copie';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrStructureCopieFactory extends Factory<CrStructureCopie> {
  protected readonly endpoint: string = 'courrier/structure-copies';

  constructor() {
    super(CrStructureCopie)
  }

}
