import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCoordonnee, ICrCoordonnee } from './cr-coordonnee';

export interface ICrDestinataire extends IBase {
  coordonnee_id: number;
  coordonnee: ICrCoordonnee;
  courrier_id: number;
}

export class CrDestinataire implements ICrDestinataire {
    id: number = 0;
    coordonnee_id:number = 0;
    courrier_id:number = 0;

    get libelle() {
      return this.coordonnee? this.coordonnee.libelle : '';
    }

    @hasOneMap({field:'cr_coordonnee', class: CrCoordonnee})
    coordonnee: ICrCoordonnee = null;
}
