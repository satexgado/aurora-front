import { Injectable } from '@angular/core';
import { CrDossier } from '../../models/gestion-courrier/cr-dossier';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrDossierFactory extends Factory<CrDossier> {
  protected readonly endpoint: string = 'courrier/dossiers';

  constructor() {
    super(CrDossier)
  }

}
