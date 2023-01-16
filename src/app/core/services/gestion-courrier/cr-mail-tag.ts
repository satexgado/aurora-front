import { Injectable } from '@angular/core';
import { CrMailTag } from '../../models/gestion-courrier/cr-mail-tag';
import { Factory } from '../factory';

@Injectable({
    providedIn: 'root'
})
export class CrMailTagFactory extends Factory<CrMailTag> {
  protected readonly endpoint: string = 'courrier/mail-tags';

  constructor() {
    super(CrMailTag)
  }

}
