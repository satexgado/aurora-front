import { Injectable } from '@angular/core';
import { GedPartage } from '../../models/gestion-document/ged-partage.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedPartageFactory extends Factory<GedPartage> {
  protected readonly endpoint: string = 'ged-partages';

  constructor() {
    super(GedPartage)
  }

}
