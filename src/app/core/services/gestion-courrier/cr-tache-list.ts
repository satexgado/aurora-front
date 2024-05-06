import { Injectable } from '@angular/core';
import { CrTacheList } from '../../models/gestion-courrier/cr-tache-list';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrTacheListFactory extends Factory<CrTacheList> {
  protected readonly endpoint: string = 'courrier/tache-lists';

  constructor() {
    super(CrTacheList)
  }

}
