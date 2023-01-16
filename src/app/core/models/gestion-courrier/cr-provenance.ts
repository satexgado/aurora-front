import { IBase } from 'src/app/core/models/base.interface';

export interface ICrProvenance extends IBase {
  externe: number;
}

export class CrProvenance implements ICrProvenance {
    id: number = 0;
    libelle: string = '';
    externe: number = 1;
}
