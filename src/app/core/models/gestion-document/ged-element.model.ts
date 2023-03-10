import { IBase } from 'src/app/core/models/base.interface';
import { dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IFichier } from './fichier.model';


export interface IGedElement extends IBase {
  date: Date;
  cacher: number;
  bloquer: number;
  user_favoris: number;
  comments_count: number;
  actif: number;
  objet: IFichier;
}

export class GedElement implements IGedElement {
    id: number = 0;

    libelle = '';

    @dateAdaptableMap('created_at')
    date = new Date();
    user_favoris = 0;
    comments_count: number = 0;
    cacher = 0;
    bloquer = 0;
    actif = 1;
    objet: IFichier = null;
}
