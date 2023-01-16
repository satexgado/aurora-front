import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrDestinataireFactory extends Factory<CrDestinataire> {
  protected readonly endpoint: string = 'courrier/destinataires';

  constructor() {
    super(CrDestinataire)
  }

}
