import { Injectable } from '@angular/core';
import { CrProvenance } from '../../models/gestion-courrier/cr-provenance';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrProvenanceFactory extends Factory<CrProvenance> {
  protected readonly endpoint: string = 'courrier/provenances';

  constructor() {
    super(CrProvenance)
  }

}
