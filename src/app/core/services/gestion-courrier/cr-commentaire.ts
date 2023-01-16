import { Injectable } from '@angular/core';
import { CrCommentaire } from '../../models/gestion-courrier/cr-commentaire';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrCommentaireFactory extends Factory<CrCommentaire> {
  protected readonly endpoint: string = 'courrier/commentaires';

  constructor() {
    super(CrCommentaire)
  }

}
