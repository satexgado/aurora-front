import { IBase } from 'src/app/core/models/base.interface';

export interface ICrCoordonneeGroupe extends IBase {
  groupe_id: number;
  cr_coordonnees: IBase[];
}

export class CrCoordonneeGroupe implements ICrCoordonneeGroupe {
    id: number = 0;
    libelle: string = '';
    groupe_id: number = null;
    cr_coordonnees: IBase[] = null;
}
