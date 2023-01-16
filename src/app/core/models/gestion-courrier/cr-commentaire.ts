import { hasOneMap, hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';
import { Fichier, IFichier } from '../gestion-document/fichier.model';
import { IUser, User } from '../user';

export interface ICrCommentaire extends IBase {
  contenu: string;
  commentaire_id: number;
  commentaire: ICrCommentaire;
  commentaires: ICrCommentaire[];
  date: Date;
  fichiers: IFichier[];
  auteur: IUser;
}


export class CrCommentaire implements ICrCommentaire {
    id: number = 0;
    @adaptableMap('libelle_commentaire')
    libelle: string = '';
    contenu: string = '';
    @adaptableMap('commentaire')
    commentaire_id: number = null;

    @dateAdaptableMap("created_at")
    date: Date = new Date();

    @hasOneMap({field: 'cr_commentaire', class: CrCommentaire})
    commentaire: ICrCommentaire = null;

    @hasManyMap({field:'cr_commentaires', class: CrCommentaire})
    commentaires: ICrCommentaire[] = null;

    @hasManyMap({field: 'fichiers', class: Fichier})
    fichiers = null;

    @hasOneMap({field: 'cpt_inscription', class: User})
    auteur: IUser = null;

}
