import { IBase } from 'src/app/core/models/base.interface';

export interface ICrCloture extends IBase {
  valider: number;
}

export class CrCloture implements ICrCloture {
    id: number = 0;
    libelle: string = '';
    valider: number = 0;
}
