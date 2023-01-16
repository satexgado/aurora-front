import { hasOneMap, hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';
import { Fichier, IFichier } from '../gestion-document/fichier.model';
import { IUser, User } from '../user';

export interface ICrMail extends IBase {
  contenu: string;
  mail_id: number;
  mail: ICrMail;
  mails: ICrMail[];
  date: Date;
  fichiers: IFichier[];
  destinataires: IUser[];
  destinataire_personnes: IUser[];
  destinataire_structures: any[];
  user_has_read: boolean;
  user_favoris: number;
  is_user_mail: number;
  auteur: IUser;
  affectations:any[];
}


export class CrMail implements ICrMail {
    id: number = 0;
    libelle: string = '';
    contenu: string = '';
    user_has_read = false;
    is_user_mail = 0;
    user_favoris = 0;
    @adaptableMap('mail')
    mail_id: number = null;

    @dateAdaptableMap("created_at")
    date: Date = new Date();

    @hasOneMap({field: 'cr_mail', class: CrMail})
    mail: ICrMail = null;

    @hasManyMap({field:'cr_mails', class: CrMail})
    mails: ICrMail[] = null;

    @hasManyMap({field: 'fichiers', class: Fichier})
    fichiers = null;

    @hasManyMap({field: 'destinataires', class: User})
    destinataires: IUser[] = null;

    @hasManyMap({field: 'destinataire_personnes', class: User})
    destinataire_personnes: IUser[] = null;

    destinataire_structures: any[] = null;

    @hasOneMap({field: 'auteur', class: User})
    auteur: IUser = null;

    get affectations() {
      return [...this.destinataire_personnes, ...this.destinataire_structures];
    }
}
