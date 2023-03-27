import { IBase } from 'src/app/core/models/base.interface';

export interface ICrUrgence extends IBase {
  couleur: string;
  delai: number;
  select_libelle;
}

export class CrUrgence implements ICrUrgence {
    id: number = 0;
    libelle: string = '';
    couleur: string = '';
    delai: number = 1;

  get select_libelle() {
    return this.libelle + ' - ' + this.delai+ ' jour(s)';
  }
}
