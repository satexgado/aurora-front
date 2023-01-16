import { dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';

export interface ICrSuivi extends IBase {
  date: Date;
  moyen: string;
  resultat: string;
}

export class CrSuivi implements ICrSuivi {
    id: number = 0;
    libelle: string = '';
    moyen: string = '';
    resultat: string = '';

    @dateAdaptableMap('date')
    date: Date = new Date();
}
