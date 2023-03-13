import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { CrCoordonneeGroupe, ICrCoordonneeGroupe } from './cr-coordonnee-groupe';

export interface ICrCoordonnee extends IBase {
  email: string;
  telephone: number;
  adresse: string;
  condition_suivi: string;
  commentaire: string;
  tag: string;
  groupes: ICrCoordonneeGroupe[];
}

export class CrCoordonnee implements ICrCoordonnee {
    id: number = 0;
    libelle: string = '';
    email = '';
    telephone: number = 0;
    adresse = '';
    condition_suivi = '';
    commentaire = '';
    tag: string = '';

    @hasManyMap({field: 'cr_coordonnee_groupes', class: CrCoordonneeGroupe})
    groupes: ICrCoordonneeGroupe[] = null;
}
