import { IBase } from 'src/app/core/models/base.interface';

export interface ICrMoyenSuivi extends IBase {
  description: string;
}

export class CrMoyenSuivi implements ICrMoyenSuivi {
    id: number = 0;
    libelle: string = '';
    description: string = '';
}
