import { IBase } from 'src/app/core/models/base.interface';

export interface ICrCoordonnee extends IBase {
  email: string;
  telephone: number;
  adresse: string;
  condition_suivi: string;
  commentaire: string;
  tag: string;
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
}
