import { FichierType } from './../../models/gestion-document/fichier-type.model';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class FichierTypeFactory extends Factory<FichierType> {
  protected readonly endpoint: string = 'fichier-types';

  constructor() {
    super(FichierType)
  }

}
