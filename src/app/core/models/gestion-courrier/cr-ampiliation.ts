import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCoordonnee, ICrCoordonnee } from './cr-coordonnee';

export interface ICrAmpiliation extends IBase {
  coordonnee_id: number;
  coordonnee: ICrCoordonnee;
  courrier_id: number;
}

export class CrAmpiliation implements ICrAmpiliation {
    id: number = 0;
    libelle: string = '';
    coordonnee_id:number = 0;
    courrier_id:number = 0;

    @hasOneMap({field:'cr_coordonnee', class: CrCoordonnee})
    coordonnee: ICrCoordonnee = null;
}
