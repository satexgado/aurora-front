import { Fichier, IFichier } from './../gestion-document/fichier.model';
import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';

export interface IMpMarcheEtape extends IBase {
  description: string;
  position: number;
  marche_id: number;
  fichiers: IFichier[];
}

export class MpMarcheEtape implements IMpMarcheEtape {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    position: number = 0;
    marche_id: number = 0;
    @hasManyMap({field: 'fichiers', class: Fichier})
    fichiers: IFichier[] = null;
}
