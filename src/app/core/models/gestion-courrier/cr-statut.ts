import { IBase } from 'src/app/core/models/base.interface';

export interface ICrStatut extends IBase {
}

export class CrStatut implements ICrStatut {
    id: number = 0;
    libelle: string = '';
}
