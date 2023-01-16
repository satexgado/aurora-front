import { Injectable } from '@angular/core';
import { GedElement } from '../../models/gestion-document/ged-element.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedElementFactory extends Factory<GedElement> {
  protected readonly endpoint: string = 'ged-elements';

  constructor() {
    super(GedElement)
  }

}
