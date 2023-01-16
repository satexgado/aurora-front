import { IBase } from 'src/app/core/models/base.interface';


export interface IGedConservation extends IBase {
  duree: number;
  description: string;
}

export class GedConservation implements IGedConservation {
    id: number = 0;
    libelle: string = '';
    duree = 1;
    description: string = '';
}
