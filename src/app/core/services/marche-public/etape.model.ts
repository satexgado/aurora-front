import { Injectable } from '@angular/core';
import { MpEtape } from '../../models/marche-public/etape.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class MpEtapeFactory extends Factory<MpEtape> {
  protected readonly endpoint: string = 'marche-public/etapes';

  constructor() {
    super(MpEtape)
  }

}
