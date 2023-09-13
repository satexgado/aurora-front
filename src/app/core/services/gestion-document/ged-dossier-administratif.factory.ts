import { Injectable } from '@angular/core';
import { GedDossierAdministratif } from '../../models/gestion-document/ged-dossier-administratif.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedDossierAdministratifFactory extends Factory<GedDossierAdministratif> {
  protected readonly endpoint: string = 'ged-dossier-administratifs';

  constructor() {
    super(GedDossierAdministratif)
  }

}
